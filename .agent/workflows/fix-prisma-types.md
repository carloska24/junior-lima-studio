---
description: Solução para erros de tipagem estrita (TS2322) entre Express e Prisma em CI/CD
---

# Deploy Fix: TypeScript Strict vs Prisma

Em ambientes de CI/CD (como GitHub Actions), o compilador TypeScript (`tsc`) roda em modo estrito e frequentemente falha ao tentar passar dados de `req.body` ou `req.params` diretamente para o `prisma.create` ou `prisma.update`.

## O Problema

O Express tipa `req.params.id` como `string | string[]` (por causa de rotas wildcard). O Prisma exige `string`.
O mesmo ocorre com `req.body` se não estiver explicitamente tipado.

Erro comum:

> `Type 'string | string[]' is not assignable to type 'string'.`

## A Solução "Nuclear"

Para garantir que o deploy passe sem erros de inferência, siga este padrão nos Controllers:

### 1. Para Params (ID)

Sempre force a conversão para string no `where`:

```typescript
// ERRADO ❌
where: {
  id: req.params.id;
}

// CERTO ✅
where: {
  id: String(req.params.id);
}
```

### 2. Para Body (Create/Update)

Use `req.body as any` para "desligar" a inferência inicial e sanitize manualmente cada campo.

```typescript
// 1. Receba como any
const { name, order, coverImageUrl } = req.body as any;

// 2. Valide obrigatórios
if (!name) return res.status(400).json({ error: 'Nome obrigatório' });

// 3. Sanitize opcionais para o tipo exato do Prisma (undefined ou null)
const category = await prisma.category.create({
  data: {
    // Force String
    name: String(name),

    // Force Number
    order: order ? Number(order) : 99,

    // Force String ou Undefined (NUNCA string[])
    coverImageUrl: typeof coverImageUrl === 'string' ? coverImageUrl : undefined,
  },
});
```

## Por que usar `String()` e não `as string`?

`as string` é apenas uma mentira para o compilador. Se chegar um array em runtime, seu app quebra.
`String(valor)` converte o valor real para texto em runtime, o que é seguro e satisfaz o compilador.
