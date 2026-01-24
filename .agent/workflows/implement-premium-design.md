---
description: Workflow para implementar features com design premium/luxo, consultando as skills apropriadas.
---

# Workflow: Implementar Design Premium (Junior Lima Studio)

// turbo-all

## 1. Consultar Skills de Design

Antes de escrever código, consulte as diretrizes de design:

1. Ler `.temp_ag_kit/.agent/skills/frontend-design/SKILL.md` para princípios de luxo (espaçamento, tipografia, cores).
2. Ler `.temp_ag_kit/.agent/skills/react-patterns/SKILL.md` para padrões de componentes limpos.

## 2. Definir Estética "Luxury"

Para manter o padrão "High-end Salon":

- **Cores**: Use a paleta `Gold` (50-950) e `Midnight` (700-950). Nunca use cores padrão ou sombras genéricas.
- **Bordas e Sombras**:
  - Bordas: `border-gold-100` ou `border-gold-200/60`.
  - Sombras: Suaves e coloridas (`shadow-gold-900/5`), nunca pretas puras.
- **Tipografia**: `font-sans` para UI, `tracking-wide` para elegância.
- **Scrollbars**: Use sempre `.scrollbar-light` em containers claros para evitar conflito com o tema escuro global.

## 3. Checklist de Implementação

- [ ] Verificar se as cores customizadas (Gold/Midnight) estão configuradas no `index.css`.
- [ ] Adicionar feedback tátil (hover states com `bg-gold-50`, transições suaves).
- [ ] Remover "artifacts" visuais (rings padrão, outlines azuis, scrollbars pretas).
- [ ] Validar contraste e legibilidade.

## 4. Verificação

- O componente parece "caro"?
- As interações são suaves (`duration-300`, `ease-out`)?
- Existe algum elemento "padrão" que quebra a imersão?

Use este workflow sempre que uma feature envolver UI visível ao usuário final ou admin.
