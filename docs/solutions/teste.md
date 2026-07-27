4. Desafio Prático — Aplicação Angular

Stack obrigatória: Angular 17+ · Angular Material · NgRx ou Signals · RxJS · Vitest ou Jest

4.1 O que construir
Reproduzir o protótipo de uma listagem de usuários. A listagem deverá ter as seguintes
funcionalidades:
Tela de listagem de usuários:

Listagem de usuários:
 Cards com os campos: nome, e-mail e botão de editar
 Filtro por nome com debounce de 300ms
 Estado de loading durante o carregamento e mensagem de erro em caso de falha
 Os dados podem vir de uma API mockada (JSON Server, MSW ou array estático em serviço)

Modal de cadastro de novo usuário com abertura através do botão vermelho que aparece na
listagem:

Criação e edição de usuário (em modal):
 Formulário reativo com campos: e-mail (obrigatório), nome (obrigatório), cpf (obrigatório), telefone
(obrigatório) e tipo de telefone.
 Validação com mensagens de erro por campo
 Botão de salvar desabilitado enquanto o formulário estiver inválido
 Quando for edição o formulário deve ser preenchido automaticamente

4.2 Requisitos técnicos
 Pelo menos 2 operadores RxJS além de map e tap em uso real (ex: switchMap, forkJoin, catchError,
debounceTime)
 Componentes standalone
 Subscriptions gerenciadas sem memory leaks (takeUntilDestroyed, take, async pipe ou unsubscribe
manual no ngOnDestroy)
 Cobertura de testes acima de 60% (Preferencialmente usando Vitest ou Jest)
4.3 Diferenciais (não obrigatórios)
 Nx Monorepo com separação em bibliotecas (ex: feature-users, data-access-users, ui)
 Paginação na listagem
 Validação de formato dos dados do formulário (e-mail,cpf e telefone)
 Melhorias no projeto em relação a tela apresentada no protótipo

⚠ Inclua um README.md com instruções de instalação e execução. Projetos que não rodam

localmente não serão avaliados.

✅ Dúvidas? Entre em contato pelo e-mail informado no processo seletivo. Boa sorte! ��

Estamos ansiosos para conhecer a sua solução.