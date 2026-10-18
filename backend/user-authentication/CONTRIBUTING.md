# Fluxo de Trabalho

## Branches
- `main`: Branch principal, contendo código estável.
- `develop`: Branch de desenvolvimento.
- `feature/*`: Branches para novas funcionalidades.
- `release/*`: Branches para preparar uma nova versão.
- `hotfix/*`: Branches para correções críticas.

## Regras
1. Todas as novas funcionalidades devem ser desenvolvidas em branches `feature/*`, criadas a partir de `develop`.
2. Somente branches `release/*` podem ser mergeadas em `main`.
3. Correções críticas devem ser feitas em branches `hotfix/*`, criadas a partir de `main`.git 