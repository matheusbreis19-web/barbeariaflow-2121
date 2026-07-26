# 📚 Guia e Catálogo de Skills Instaladas

Este documento contém a relação completa de **326 skills** instaladas e configuradas no ambiente local (`.agents/skills/`) e global do Agente.

## 🌟 Resumo dos Pacotes e Principais Ferramentas

### 🛡️ Segurança & Auditoria

| Skill | Descrição / Função Principal |
| :--- | :--- |
| **`backend-security-coder`** | Expert in secure backend coding practices specializing in input |
| **`clean-code-guard`** | Review generated or changed production code before it ships, using Clean Code, SOLID, DRY, KISS, YAGNI, and LLM-specific failure-mode checks in any programming language. Best used reactively after an agent writes, edits, refactors, or fixes code, before presenting, committing, or merging the result. Use when the user asks "review this PR", "is this safe to merge?", "make this cleaner", "audit this code", "refactor this", "fix this bug", or after a coding agent produced implementation code. Can also guide writing when explicitly invoked before a risky edit. Invoke it on your own initiative the moment you finish writing, editing, or refactoring non-trivial production code, before presenting or committing — don't wait to be asked. DO NOT USE for factual/conceptual questions, CI/tooling config, git workflow, running/debugging tests, pure architecture discussion, prose writing, data analysis, or test-code review (use test-guard). |
| **`docs-guard`** | Review generated or changed documentation before it ships — READMEs, API references, docstrings, PHPDoc/JSDoc, changelogs, tutorials, and doc sites. Best used reactively after an agent writes or edits docs, after code changes documented behavior, or before publishing docs. Use when the user says 'review the docs', 'is this documentation accurate', 'update the docs', 'write a README', 'document this API', 'add a docstring', or 'add a changelog entry'. Core job: verify every referenced function, flag, endpoint, config key, and code sample against the source; catch docs-vs-code drift; strip filler and unverifiable claims. DO NOT USE for production code review (use clean-code-guard), test review (use test-guard), marketing copy or blog posts, prose style editing of non-technical writing, or documentation site theming. |
| **`frontend-security-coder`** | Expert in secure frontend coding practices specializing in XSS |
| **`sast-configuration`** | Configure Static Application Security Testing (SAST) tools for automated vulnerability detection in application code. Use when setting up security scanning, implementing DevSecOps practices, or automating code vulnerability detection. |
| **`security-scanning-security-hardening`** | Coordinate multi-layer security scanning and hardening across application, infrastructure, and compliance controls. |
| **`test-guard`** | Review generated or changed test code against universal testing rules before it ships. Best used reactively after an agent writes, edits, generates, or refactors tests, before presenting, committing, or merging them. Use for pytest (test_*.py, *_test.py), PHPUnit/Pest (*Test.php), Jest/Vitest (*.test.ts, *.spec.js), Go (*_test.go), files under tests/, __tests__/, or spec/, and review requests like 'write tests for X', 'add tests', 'test this', 'review these tests', or PR diffs containing tests. Can also guide test writing when explicitly invoked before the work. This skill is the quality gate that prevents AI-generated test bloat. DO NOT USE for production or implementation code review (use clean-code-guard), CI or test-runner configuration, running or debugging tests, or general architecture discussion. |

### ⚡ Supabase & Banco de Dados

| Skill | Descrição / Função Principal |
| :--- | :--- |
| **`database-migrations-sql-migrations`** | SQL database migrations with zero-downtime strategies for |
| **`postgresql`** | Design a PostgreSQL-specific schema. Covers best-practices, data types, indexing, constraints, performance patterns, and advanced features |
| **`sql-pro`** | Master modern SQL with cloud-native databases, OLTP/OLAP |
| **`supabase`** | Use when doing ANY task involving Supabase. Triggers: Supabase products (Database, Auth, Edge Functions, Realtime, Storage, Vectors, Cron, Queues); client libraries and SSR integrations (supabase-js, @supabase/ssr) in Next.js, React, SvelteKit, Astro, Remix; auth issues (login, logout, sessions, JWT, cookies, getSession, getUser, getClaims, RLS); Supabase CLI or MCP server; schema changes, migrations, declarative schemas, security audits, Postgres extensions (pg_graphql, pg_cron, pg_vector). |
| **`supabase-postgres-best-practices`** | Postgres performance optimization and best practices from Supabase. Use this skill when writing, reviewing, or optimizing Postgres queries, schema designs, or database configurations. |

### 🎨 UI/UX & Frontend

| Skill | Descrição / Função Principal |
| :--- | :--- |
| **`frontend-expert`** | Use when creating React/TypeScript components, pages, or features. For modern patterns including Suspense, useSuspenseQuery, lazy loading, MUI v7 styling, TanStack Router, and performance optimization. |
| **`nextjs-app-router-patterns`** | Master Next.js 14+ App Router with Server Components, streaming, parallel routes, and advanced data fetching. Use when building Next.js applications, implementing SSR/SSG, or optimizing React Server Components. |
| **`tailwind-design-system`** | Build scalable design systems with Tailwind CSS, design tokens, component libraries, and responsive patterns. Use when creating component libraries, implementing design systems, or standardizing UI patterns. |
| **`uiux-designer`** | Use this skill when designing UI components, choosing color palettes, implementing responsive layouts, or reviewing code for UX issues. For landing pages, dashboards, e-commerce, SaaS, and mobile apps. Provides 50+ design styles, 97 color palettes, 57 font pairings, and stack-specific guidelines for React, Vue, Next.js, Flutter, SwiftUI, and more. |

### 🚀 DevOps, Deploy & Qualidade

| Skill | Descrição / Função Principal |
| :--- | :--- |
| **`e2e-testing-patterns`** | Master end-to-end testing with Playwright and Cypress to build reliable test suites that catch bugs, improve confidence, and enable fast deployment. Use when implementing E2E tests, debugging flaky tests, or establishing testing standards. |
| **`test-automator`** | Master AI-powered test automation with modern frameworks, |

### 📋 Governança & Gerenciamento de Projetos

| Skill | Descrição / Função Principal |
| :--- | :--- |
| **`pm-all`** | Orchestrate full governance scan with prerequisite gates; default noise-filtered summary; rebuild .pm/dashboard aggregate. |
| **`pm-arch`** | Scan project structure and generate Mermaid architecture diagrams + flowcharts under .pm/architecture/. |
| **`pm-discover`** | Deep-scan all enabled governance modules and refresh state (internal; used by pm-all / status --full). |
| **`pm-done`** | Close a todo (TODO-xxx), sync completed.md, refresh overview Top3. |
| **`pm-fix`** | Analyze pasted logs/stacks/slow SQL from chat (or --path) into bugs findings and todos. |
| **`pm-init`** | Initialize local .pm governance workbench; detect new vs existing project; discover Spec Kit constitution; optional outline from intent. |
| **`pm-manager`** | Project governance workbench (/pm-*). Use for /pm-init, /pm-status, /pm-next, /pm-done, /pm-fix, /pm-all, /pm-outline, /pm-charter, /pm-export, /pm-arch, project health Top3, pasted logs/stacks, Spec Kit constitution discovery, and local .pm governance. Triggers on project management, governance, what should I do today, help me with this error. |
| **`pm-next`** | >- |
| **`pm-status`** | Show governance health, iteration progress, and today's Top3 actionable todos. Primary daily entry. |

### 💳 Integrações & Regras de Negócio

| Skill | Descrição / Função Principal |
| :--- | :--- |
| **`agent-tool-builder`** | Tools are how AI agents interact with the world. A well-designed |
| **`payment-integration`** | Integrate Stripe, PayPal, and payment processors. Handles checkout |
| **`stripe-integration`** | Implement Stripe payment processing for robust, PCI-compliant payment flows including checkout, subscriptions, and webhooks. Use when integrating Stripe payments, building subscription systems, or implementing secure checkout flows. |

## 📋 Catálogo Completo de Todas as Skills Instaladas

| Skill | Descrição |
| :--- | :--- |
| **`AI Code Review`** | You are an expert AI-powered code review specialist combining automated static analysis, intelligent pattern recognition, and modern DevOps practices. Leverage AI tools (GitHub Copilot, Qodo, GPT-5, C |
| **`CI`** | Configure and optimize Nx monorepo workspaces. Use when setting up Nx, configuring project boundaries, optimizing build caching, or implementing affected commands. |
| **`Deploy to Production`** | Create production-ready GitHub Actions workflows for automated testing, building, and deploying applications. Use when setting up CI/CD with GitHub Actions, automating development workflows, or creating reusable workflow templates. |
| **`Deploy with Vault Secrets`** | Implement secure secrets management for CI/CD pipelines using Vault, AWS Secrets Manager, or native platform solutions. Use when handling sensitive credentials, rotating secrets, or securing CI/CD environments. |
| **`Migration Monitoring`** | Migration monitoring, CDC, and observability infrastructure |
| **`Production Pipeline`** | Design multi-stage CI/CD pipelines with approval gates, security checks, and deployment orchestration. Use when architecting deployment workflows, setting up continuous delivery, or implementing GitOps practices. |
| **`SAST Scan`** | Static Application Security Testing (SAST) for code vulnerability |
| **`ShellCheck`** | Master ShellCheck static analysis configuration and usage for shell script quality. Use when setting up linting infrastructure, fixing code issues, or ensuring script portability. |
| **`Tests`** | Test smart contracts comprehensively using Hardhat and Foundry with unit tests, integration tests, and mainnet forking. Use when testing Solidity contracts, setting up blockchain test suites, or validating DeFi protocols. |
| **`accessibility-compliance-accessibility-audit`** | You are an accessibility expert specializing in WCAG compliance, inclusive design, and assistive technology compatibility. Conduct audits, identify barriers, and provide remediation guidance. |
| **`agent-orchestration-improve-agent`** | Systematic improvement of existing agents through performance analysis, prompt engineering, and continuous iteration. |
| **`agent-orchestration-multi-agent-optimize`** | Optimize multi-agent systems with coordinated profiling, workload distribution, and cost-aware orchestration. Use when improving agent performance, throughput, or reliability. |
| **`agent-tool-builder`** | Tools are how AI agents interact with the world. A well-designed |
| **`ai-engineer`** | Build production-ready LLM applications, advanced RAG systems, and |
| **`airflow-dag-patterns`** | Build production Apache Airflow DAGs with best practices for operators, sensors, testing, and deployment. Use when creating data pipelines, orchestrating workflows, or scheduling batch jobs. |
| **`angular-migration`** | Migrate from AngularJS to Angular using hybrid mode, incremental component rewriting, and dependency injection updates. Use when upgrading AngularJS applications, planning framework migrations, or modernizing legacy Angular code. |
| **`anti-reversing-techniques`** | Understand anti-reversing, obfuscation, and protection techniques encountered during software analysis. Use when analyzing protected binaries, bypassing anti-debugging for authorized analysis, or understanding software protection mechanisms. |
| **`api-design-principles`** | Master REST and GraphQL API design principles to build intuitive, scalable, and maintainable APIs that delight developers. Use when designing new APIs, reviewing API specifications, or establishing API design standards. |
| **`api-documenter`** | Master API documentation with OpenAPI 3.1, AI-powered tools, and |
| **`api-testing-observability-api-mock`** | You are an API mocking expert specializing in realistic mock services for development, testing, and demos. Design mocks that simulate real API behavior and enable parallel development. |
| **`application-performance-performance-optimization`** | Optimize end-to-end application performance with profiling, observability, and backend/frontend tuning. Use when coordinating performance optimization across the stack. |
| **`architect-review`** | Master software architect specializing in modern architecture |
| **`architecture-decision-records`** | Write and maintain Architecture Decision Records (ADRs) following best practices for technical decision documentation. Use when documenting significant technical decisions, reviewing past architectural choices, or establishing decision processes. |
| **`architecture-patterns`** | Implement proven backend architecture patterns including Clean Architecture, Hexagonal Architecture, and Domain-Driven Design. Use when architecting complex backend systems or refactoring existing applications for better maintainability. |
| **`arm-cortex-expert`** | > |
| **`article-illustrations`** | Generate hand-drawn 16:9 article illustrations featuring the Grav character IP. Turns article concepts into memorable whiteboard-sketch explanations with a recurring floating character, sparse annotations, and absurd metaphors. |
| **`async-python-patterns`** | Master Python asyncio, concurrent programming, and async/await patterns for high-performance applications. Use when building async APIs, concurrent systems, or I/O-bound applications requiring non-blocking operations. |
| **`attack-tree-construction`** | Build comprehensive attack trees to visualize threat paths. Use when mapping attack scenarios, identifying defense gaps, or communicating security risks to stakeholders. |
| **`auth-implementation-patterns`** | Master authentication and authorization patterns including JWT, OAuth2, session management, and RBAC to build secure, scalable access control systems. Use when implementing auth systems, securing APIs, or debugging security issues. |
| **`backend-architect`** | Expert backend architect specializing in scalable API design, |
| **`backend-development-feature-development`** | Orchestrate end-to-end backend feature development from requirements to deployment. Use when coordinating multi-phase feature delivery across teams and services. |
| **`backend-security-coder`** | Expert in secure backend coding practices specializing in input |
| **`backtesting-frameworks`** | Build robust backtesting systems for trading strategies with proper handling of look-ahead bias, survivorship bias, and transaction costs. Use when developing trading algorithms, validating strategies, or building backtesting infrastructure. |
| **`bash-defensive-patterns`** | Master defensive Bash programming techniques for production-grade scripts. Use when writing robust shell scripts, CI/CD pipelines, or system utilities requiring fault tolerance and safety. |
| **`bash-pro`** | Master of defensive Bash scripting for production automation, CI/CD |
| **`bats-testing-patterns`** | Master Bash Automated Testing System (Bats) for comprehensive shell script testing. Use when writing tests for shell scripts, CI/CD pipelines, or requiring test-driven development of shell utilities. |
| **`bazel-build-optimization`** | Optimize Bazel builds for large-scale monorepos. Use when configuring Bazel, implementing remote execution, or optimizing build performance for enterprise codebases. |
| **`billing-automation`** | Build automated billing systems for recurring payments, invoicing, subscription lifecycle, and dunning management. Use when implementing subscription billing, automating invoicing, or managing recurring payment systems. |
| **`binary-analysis-patterns`** | Master binary analysis patterns including disassembly, decompilation, control flow analysis, and code pattern recognition. Use when analyzing executables, understanding compiled code, or performing static analysis on binaries. |
| **`blockchain-developer`** | Build production-ready Web3 applications, smart contracts, and |
| **`business-analyst`** | Master modern business analysis with AI-powered analytics, |
| **`c-pro`** | Write efficient C code with proper memory management, pointer |
| **`c4-architecture-c4-architecture`** | Generate comprehensive C4 architecture documentation for an existing repository/codebase using a bottom-up analysis approach. |
| **`c4-code`** | Expert C4 Code-level documentation specialist. Analyzes code |
| **`c4-component`** | Expert C4 Component-level documentation specialist. Synthesizes C4 |
| **`c4-container`** | Expert C4 Container-level documentation specialist. Synthesizes |
| **`c4-context`** | Expert C4 Context-level documentation specialist. Creates |
| **`changelog-automation`** | Automate changelog generation from commits, PRs, and releases following Keep a Changelog format. Use when setting up release workflows, generating release notes, or standardizing commit conventions. |
| **`cicd-automation-workflow-automate`** | You are a workflow automation expert specializing in creating efficient CI/CD pipelines, GitHub Actions workflows, and automated development processes. Design automation that reduces manual work, improves consistency, and accelerates delivery while maintaining quality and security. |
| **`clean-code-guard`** | Review generated or changed production code before it ships, using Clean Code, SOLID, DRY, KISS, YAGNI, and LLM-specific failure-mode checks in any programming language. Best used reactively after an agent writes, edits, refactors, or fixes code, before presenting, committing, or merging the result. Use when the user asks "review this PR", "is this safe to merge?", "make this cleaner", "audit this code", "refactor this", "fix this bug", or after a coding agent produced implementation code. Can also guide writing when explicitly invoked before a risky edit. Invoke it on your own initiative the moment you finish writing, editing, or refactoring non-trivial production code, before presenting or committing — don't wait to be asked. DO NOT USE for factual/conceptual questions, CI/tooling config, git workflow, running/debugging tests, pure architecture discussion, prose writing, data analysis, or test-code review (use test-guard). |
| **`cloud-architect`** | Expert cloud architect specializing in AWS/Azure/GCP multi-cloud |
| **`code-documentation-code-explain`** | You are a code education expert specializing in explaining complex code through clear narratives, visual diagrams, and step-by-step breakdowns. Transform difficult concepts into understandable explanations. |
| **`code-documentation-doc-generate`** | You are a documentation expert specializing in creating comprehensive, maintainable documentation from code. Generate API docs, architecture diagrams, user guides, and technical references using AI-powered analysis and industry best practices. |
| **`code-refactoring-context-restore`** | Use when working with code refactoring context restore |
| **`code-refactoring-refactor-clean`** | You are a code refactoring expert specializing in clean code principles, SOLID design patterns, and modern software engineering best practices. Analyze and refactor the provided code to improve its quality, maintainability, and performance. |
| **`code-refactoring-tech-debt`** | You are a technical debt expert specializing in identifying, quantifying, and prioritizing technical debt in software projects. Analyze the codebase to uncover debt, assess its impact, and create acti |
| **`code-review-excellence`** | Master effective code review practices to provide constructive feedback, catch bugs early, and foster knowledge sharing while maintaining team morale. Use when reviewing pull requests, establishing review standards, or mentoring developers. |
| **`code-reviewer`** | Elite code review expert specializing in modern AI-powered code |
| **`codebase-cleanup-deps-audit`** | You are a dependency security expert specializing in vulnerability scanning, license compliance, and supply chain security. Analyze project dependencies for known vulnerabilities, licensing issues, outdated packages, and provide actionable remediation strategies. |
| **`codebase-cleanup-refactor-clean`** | You are a code refactoring expert specializing in clean code principles, SOLID design patterns, and modern software engineering best practices. Analyze and refactor the provided code to improve its quality, maintainability, and performance. |
| **`codebase-cleanup-tech-debt`** | You are a technical debt expert specializing in identifying, quantifying, and prioritizing technical debt in software projects. Analyze the codebase to uncover debt, assess its impact, and create acti |
| **`competitive-landscape`** | This skill should be used when the user asks to "analyze |
| **`comprehensive-review-full-review`** | Use when working with comprehensive review full review |
| **`comprehensive-review-pr-enhance`** | You are a PR optimization expert specializing in creating high-quality pull requests that facilitate efficient code reviews. Generate comprehensive PR descriptions, automate review processes, and ensure PRs follow best practices for clarity, size, and reviewability. |
| **`conductor-implement`** | Execute tasks from a track's implementation plan following TDD workflow |
| **`conductor-manage`** | Manage track lifecycle: archive, restore, delete, rename, and cleanup |
| **`conductor-new-track`** | Create a new track with specification and phased implementation plan |
| **`conductor-revert`** | Git-aware undo by logical work unit (track, phase, or task) |
| **`conductor-setup`** | Initialize project with Conductor artifacts (product definition, |
| **`conductor-status`** | Display project status, active tracks, and next actions |
| **`conductor-validator`** | Validates Conductor project artifacts for completeness, |
| **`content-marketer`** | Elite content marketing strategist specializing in AI-powered |
| **`context-driven-development`** | Use this skill when working with Conductor's context-driven |
| **`context-management-context-restore`** | Use when working with context management context restore |
| **`context-management-context-save`** | Use when working with context management context save |
| **`context-manager`** | Elite AI context engineering specialist mastering dynamic context |
| **`cost-optimization`** | Optimize cloud costs through resource rightsizing, tagging strategies, reserved instances, and spending analysis. Use when reducing cloud expenses, analyzing infrastructure costs, or implementing cost governance policies. |
| **`cpp-pro`** | Write idiomatic C++ code with modern features, RAII, smart |
| **`cqrs-implementation`** | Implement Command Query Responsibility Segregation for scalable architectures. Use when separating read and write models, optimizing query performance, or building event-sourced systems. |
| **`csharp-pro`** | Write modern C# code with advanced features like records, pattern |
| **`customer-support`** | Elite AI-powered customer support specialist mastering |
| **`data-engineer`** | Build scalable data pipelines, modern data warehouses, and |
| **`data-engineering-data-driven-feature`** | Build features guided by data insights, A/B testing, and continuous measurement using specialized agents for analysis, implementation, and experimentation. |
| **`data-engineering-data-pipeline`** | You are a data pipeline architecture expert specializing in scalable, reliable, and cost-effective data pipelines for batch and streaming data processing. |
| **`data-quality-frameworks`** | Implement data quality validation with Great Expectations, dbt tests, and data contracts. Use when building data quality pipelines, implementing validation rules, or establishing data contracts. |
| **`data-scientist`** | Expert data scientist for advanced analytics, machine learning, and |
| **`data-storytelling`** | Transform data into compelling narratives using visualization, context, and persuasive structure. Use when presenting analytics to stakeholders, creating data reports, or building executive presentations. |
| **`database-admin`** | Expert database administrator specializing in modern cloud |
| **`database-architect`** | Expert database architect specializing in data layer design from |
| **`database-cloud-optimization-cost-optimize`** | You are a cloud cost optimization expert specializing in reducing infrastructure expenses while maintaining performance and reliability. Analyze cloud spending, identify savings opportunities, and implement cost-effective architectures across AWS, Azure, and GCP. |
| **`database-migration`** | Execute database migrations across ORMs and platforms with zero-downtime strategies, data transformation, and rollback procedures. Use when migrating databases, changing schemas, performing data transformations, or implementing zero-downtime deployment strategies. |
| **`database-migrations-sql-migrations`** | SQL database migrations with zero-downtime strategies for |
| **`database-optimizer`** | Expert database optimizer specializing in modern performance |
| **`dbt-transformation-patterns`** | Master dbt (data build tool) for analytics engineering with model organization, testing, documentation, and incremental strategies. Use when building data transformations, creating data models, or implementing analytics engineering best practices. |
| **`debugger`** | Debugging specialist for errors, test failures, and unexpected |
| **`debugging-strategies`** | Master systematic debugging techniques, profiling tools, and root cause analysis to efficiently track down bugs across any codebase or technology stack. Use when investigating bugs, performance issues, or unexpected behavior. |
| **`debugging-toolkit-smart-debug`** | Use when working with debugging toolkit smart debug |
| **`defi-protocol-templates`** | Implement DeFi protocols with production-ready templates for staking, AMMs, governance, and lending systems. Use when building decentralized finance applications or smart contract protocols. |
| **`dependency-management-deps-audit`** | You are a dependency security expert specializing in vulnerability scanning, license compliance, and supply chain security. Analyze project dependencies for known vulnerabilities, licensing issues, outdated packages, and provide actionable remediation strategies. |
| **`dependency-upgrade`** | Manage major dependency version upgrades with compatibility analysis, staged rollout, and comprehensive testing. Use when upgrading framework versions, updating major dependencies, or managing breaking changes in libraries. |
| **`deployment-engineer`** | Expert deployment engineer specializing in modern CI/CD pipelines, |
| **`deployment-validation-config-validate`** | You are a configuration management expert specializing in validating, testing, and ensuring the correctness of application configurations. Create comprehensive validation schemas, implement configurat |
| **`devops-troubleshooter`** | Expert DevOps troubleshooter specializing in rapid incident |
| **`distributed-debugging-debug-trace`** | You are a debugging expert specializing in setting up comprehensive debugging environments, distributed tracing, and diagnostic tools. Configure debugging workflows, implement tracing solutions, and establish troubleshooting practices for development and production environments. |
| **`distributed-tracing`** | Implement distributed tracing with Jaeger and Tempo to track requests across microservices and identify performance bottlenecks. Use when debugging microservices, analyzing request flows, or implementing observability for distributed systems. |
| **`django-pro`** | Master Django 5.x with async views, DRF, Celery, and Django |
| **`docs-architect`** | Creates comprehensive technical documentation from existing |
| **`docs-guard`** | Review generated or changed documentation before it ships — READMEs, API references, docstrings, PHPDoc/JSDoc, changelogs, tutorials, and doc sites. Best used reactively after an agent writes or edits docs, after code changes documented behavior, or before publishing docs. Use when the user says 'review the docs', 'is this documentation accurate', 'update the docs', 'write a README', 'document this API', 'add a docstring', or 'add a changelog entry'. Core job: verify every referenced function, flag, endpoint, config key, and code sample against the source; catch docs-vs-code drift; strip filler and unverifiable claims. DO NOT USE for production code review (use clean-code-guard), test review (use test-guard), marketing copy or blog posts, prose style editing of non-technical writing, or documentation site theming. |
| **`documentation-generation-doc-generate`** | You are a documentation expert specializing in creating comprehensive, maintainable documentation from code. Generate API docs, architecture diagrams, user guides, and technical references using AI-powered analysis and industry best practices. |
| **`dotnet-architect`** | Expert .NET backend architect specializing in C#, ASP.NET Core, |
| **`dotnet-backend-patterns`** | Master C#/.NET backend development patterns for building robust APIs, MCP servers, and enterprise applications. Covers async/await, dependency injection, Entity Framework Core, Dapper, configuration, caching, and testing with xUnit. Use when developing .NET backends, reviewing C# code, or designing API architectures. |
| **`dx-optimizer`** | Developer Experience specialist. Improves tooling, setup, and |
| **`e2e-testing-patterns`** | Master end-to-end testing with Playwright and Cypress to build reliable test suites that catch bugs, improve confidence, and enable fast deployment. Use when implementing E2E tests, debugging flaky tests, or establishing testing standards. |
| **`elixir-pro`** | Write idiomatic Elixir code with OTP patterns, supervision trees, |
| **`embedding-strategies`** | Select and optimize embedding models for semantic search and RAG applications. Use when choosing embedding models, implementing chunking strategies, or optimizing embedding quality for specific domains. |
| **`employment-contract-templates`** | Create employment contracts, offer letters, and HR policy documents following legal best practices. Use when drafting employment agreements, creating HR policies, or standardizing employment documentation. |
| **`error-debugging-error-analysis`** | You are an expert error analysis specialist with deep expertise in debugging distributed systems, analyzing production incidents, and implementing comprehensive observability solutions. |
| **`error-debugging-error-trace`** | You are an error tracking and observability expert specializing in implementing comprehensive error monitoring solutions. Set up error tracking systems, configure alerts, implement structured logging, and ensure teams can quickly identify and resolve production issues. |
| **`error-debugging-multi-agent-review`** | Use when working with error debugging multi agent review |
| **`error-detective`** | Search logs and codebases for error patterns, stack traces, and |
| **`error-diagnostics-error-analysis`** | You are an expert error analysis specialist with deep expertise in debugging distributed systems, analyzing production incidents, and implementing comprehensive observability solutions. |
| **`error-diagnostics-error-trace`** | You are an error tracking and observability expert specializing in implementing comprehensive error monitoring solutions. Set up error tracking systems, configure alerts, implement structured logging, |
| **`error-diagnostics-smart-debug`** | Use when working with error diagnostics smart debug |
| **`error-handling-patterns`** | Master error handling patterns across languages including exceptions, Result types, error propagation, and graceful degradation to build resilient applications. Use when implementing error handling, designing APIs, or improving application reliability. |
| **`event-sourcing-architect`** | Expert in event sourcing, CQRS, and event-driven architecture patterns. Masters event store design, projection building, saga orchestration, and eventual consistency patterns. Use PROACTIVELY for event-sourced systems, audit trails, or temporal queries. |
| **`event-store-design`** | Design and implement event stores for event-sourced systems. Use when building event sourcing infrastructure, choosing event store technologies, or implementing event persistence patterns. |
| **`fastapi-pro`** | Build high-performance async APIs with FastAPI, SQLAlchemy 2.0, and |
| **`fastapi-templates`** | Create production-ready FastAPI projects with async patterns, dependency injection, and comprehensive error handling. Use when building new FastAPI applications or setting up backend API projects. |
| **`firmware-analyst`** | Expert firmware analyst specializing in embedded systems, IoT |
| **`flutter-expert`** | Master Flutter development with Dart 3, advanced widgets, and |
| **`framework-migration-code-migrate`** | You are a code migration expert specializing in transitioning codebases between frameworks, languages, versions, and platforms. Generate comprehensive migration plans, automated migration scripts, and |
| **`framework-migration-deps-upgrade`** | You are a dependency management expert specializing in safe, incremental upgrades of project dependencies. Plan and execute dependency updates with minimal risk, proper testing, and clear migration pa |
| **`framework-migration-legacy-modernize`** | Orchestrate a comprehensive legacy system modernization using the strangler fig pattern, enabling gradual replacement of outdated components while maintaining continuous business operations through ex |
| **`frontend-developer`** | Build React components, implement responsive layouts, and handle |
| **`frontend-expert`** | Use when creating React/TypeScript components, pages, or features. For modern patterns including Suspense, useSuspenseQuery, lazy loading, MUI v7 styling, TanStack Router, and performance optimization. |
| **`frontend-mobile-development-component-scaffold`** | You are a React component architecture expert specializing in scaffolding production-ready, accessible, and performant components. Generate complete component implementations with TypeScript, tests, s |
| **`frontend-mobile-security-xss-scan`** | You are a frontend security specialist focusing on Cross-Site Scripting (XSS) vulnerability detection and prevention. Analyze React, Vue, Angular, and vanilla JavaScript code to identify injection poi |
| **`frontend-security-coder`** | Expert in secure frontend coding practices specializing in XSS |
| **`full-stack-orchestration-full-stack-feature`** | Use when working with full stack orchestration full stack feature |
| **`gdpr-data-handling`** | Implement GDPR-compliant data handling with consent management, data subject rights, and privacy by design. Use when building systems that process EU personal data, implementing privacy controls, or conducting GDPR compliance reviews. |
| **`git-advanced-workflows`** | Master advanced Git workflows including rebasing, cherry-picking, bisect, worktrees, and reflog to maintain clean history and recover from any situation. Use when managing complex Git histories, collaborating on feature branches, or troubleshooting repository issues. |
| **`git-pr-workflows-git-workflow`** | Orchestrate a comprehensive git workflow from code review through PR creation, leveraging specialized agents for quality assurance, testing, and deployment readiness. This workflow implements modern g |
| **`git-pr-workflows-onboard`** | You are an **expert onboarding specialist and knowledge transfer architect** with deep experience in remote-first organizations, technical team integration, and accelerated learning methodologies. You |
| **`git-pr-workflows-pr-enhance`** | You are a PR optimization expert specializing in creating high-quality pull requests that facilitate efficient code reviews. Generate comprehensive PR descriptions, automate review processes, and ensu |
| **`gitlab-ci-patterns`** | Build GitLab CI/CD pipelines with multi-stage workflows, caching, and distributed runners for scalable automation. Use when implementing GitLab CI/CD, optimizing pipeline performance, or setting up automated testing and deployment. |
| **`gitops-workflow`** | Implement GitOps workflows with ArgoCD and Flux for automated, declarative Kubernetes deployments with continuous reconciliation. Use when implementing GitOps practices, automating Kubernetes deployments, or setting up declarative infrastructure management. |
| **`go-concurrency-patterns`** | Master Go concurrency with goroutines, channels, sync primitives, and context. Use when building concurrent Go applications, implementing worker pools, or debugging race conditions. |
| **`godot-gdscript-patterns`** | Master Godot 4 GDScript patterns including signals, scenes, state machines, and optimization. Use when building Godot games, implementing game systems, or learning GDScript best practices. |
| **`golang-pro`** | Master Go 1.21+ with modern patterns, advanced concurrency, |
| **`grafana-dashboards`** | Create and manage production Grafana dashboards for real-time visualization of system and application metrics. Use when building monitoring dashboards, visualizing metrics, or creating operational observability interfaces. |
| **`graphql-architect`** | Master modern GraphQL with federation, performance optimization, |
| **`haskell-pro`** | Expert Haskell engineer specializing in advanced type systems, pure |
| **`helm-chart-scaffolding`** | Design, organize, and manage Helm charts for templating and packaging Kubernetes applications with reusable configurations. Use when creating Helm charts, packaging Kubernetes applications, or implementing templated deployments. |
| **`hr-pro`** | Professional, ethical HR partner for hiring, |
| **`hybrid-cloud-architect`** | Expert hybrid cloud architect specializing in complex multi-cloud |
| **`hybrid-cloud-networking`** | Configure secure, high-performance connectivity between on-premises infrastructure and cloud platforms using VPN and dedicated connections. Use when building hybrid cloud architectures, connecting data centers to cloud, or implementing secure cross-premises networking. |
| **`hybrid-search-implementation`** | Combine vector and keyword search for improved retrieval. Use when implementing RAG systems, building search engines, or when neither approach alone provides sufficient recall. |
| **`incident-responder`** | Expert SRE incident responder specializing in rapid problem |
| **`incident-response-incident-response`** | Use when working with incident response incident response |
| **`incident-response-smart-fix`** | [Extended thinking: This workflow implements a sophisticated debugging and resolution pipeline that leverages AI-assisted debugging tools and observability platforms to systematically diagnose and res |
| **`incident-runbook-templates`** | Create structured incident response runbooks with step-by-step procedures, escalation paths, and recovery actions. Use when building runbooks, responding to incidents, or establishing incident response procedures. |
| **`ios-developer`** | Develop native iOS applications with Swift/SwiftUI. Masters iOS 18, |
| **`istio-traffic-management`** | Configure Istio traffic management including routing, load balancing, circuit breakers, and canary deployments. Use when implementing service mesh traffic policies, progressive delivery, or resilience patterns. |
| **`java-pro`** | Master Java 21+ with modern features like virtual threads, pattern |
| **`javascript-pro`** | Master modern JavaScript with ES6+, async patterns, and Node.js |
| **`javascript-testing-patterns`** | Implement comprehensive testing strategies using Jest, Vitest, and Testing Library for unit tests, integration tests, and end-to-end testing with mocking, fixtures, and test-driven development. Use when writing JavaScript/TypeScript tests, setting up test infrastructure, or implementing TDD/BDD workflows. |
| **`javascript-typescript-typescript-scaffold`** | You are a TypeScript project architecture expert specializing in scaffolding production-ready Node.js and frontend applications. Generate complete project structures with modern tooling (pnpm, Vite, N |
| **`julia-pro`** | Master Julia 1.10+ with modern features, performance optimization, |
| **`k8s-manifest-generator`** | Create production-ready Kubernetes manifests for Deployments, Services, ConfigMaps, and Secrets following best practices and security standards. Use when generating Kubernetes YAML manifests, creating K8s resources, or implementing production-grade Kubernetes configurations. |
| **`k8s-security-policies`** | Implement Kubernetes security policies including NetworkPolicy, PodSecurityPolicy, and RBAC for production-grade security. Use when securing Kubernetes clusters, implementing network isolation, or enforcing pod security standards. |
| **`kpi-dashboard-design`** | Design effective KPI dashboards with metrics selection, visualization best practices, and real-time monitoring patterns. Use when building business dashboards, selecting metrics, or designing data visualization layouts. |
| **`kubernetes-architect`** | Expert Kubernetes architect specializing in cloud-native |
| **`langchain-architecture`** | Design LLM applications using the LangChain framework with agents, memory, and tool integration patterns. Use when building LangChain applications, implementing AI agents, or creating complex LLM workflows. |
| **`legacy-modernizer`** | Refactor legacy codebases, migrate outdated frameworks, and |
| **`legal-advisor`** | Draft privacy policies, terms of service, disclaimers, and legal |
| **`linkerd-patterns`** | Implement Linkerd service mesh patterns for lightweight, security-focused service mesh deployments. Use when setting up Linkerd, configuring traffic policies, or implementing zero-trust networking with minimal overhead. |
| **`llm-application-dev-ai-assistant`** | You are an AI assistant development expert specializing in creating intelligent conversational interfaces, chatbots, and AI-powered applications. Design comprehensive AI assistant solutions with natur |
| **`llm-application-dev-langchain-agent`** | You are an expert LangChain agent developer specializing in production-grade AI systems using LangChain 0.1+ and LangGraph. |
| **`llm-application-dev-prompt-optimize`** | You are an expert prompt engineer specializing in crafting effective prompts for LLMs through advanced techniques including constitutional AI, chain-of-thought reasoning, and model-specific optimizati |
| **`llm-evaluation`** | Implement comprehensive evaluation strategies for LLM applications using automated metrics, human feedback, and benchmarking. Use when testing LLM performance, measuring AI application quality, or establishing evaluation frameworks. |
| **`machine-learning-ops-ml-pipeline`** | Design and implement a complete ML pipeline for: $ARGUMENTS |
| **`malware-analyst`** | Expert malware analyst specializing in defensive malware research, |
| **`market-sizing-analysis`** | This skill should be used when the user asks to "calculate TAM", |
| **`memory-forensics`** | Master memory forensics techniques including memory acquisition, process analysis, and artifact extraction using Volatility and related tools. Use when analyzing memory dumps, investigating incidents, or performing malware analysis from RAM captures. |
| **`memory-safety-patterns`** | Implement memory-safe programming with RAII, ownership, smart pointers, and resource management across Rust, C++, and C. Use when writing safe systems code, managing resources, or preventing memory bugs. |
| **`mermaid-expert`** | Create Mermaid diagrams for flowcharts, sequences, ERDs, and |
| **`microservices-patterns`** | Design microservices architectures with service boundaries, event-driven communication, and resilience patterns. Use when building distributed systems, decomposing monoliths, or implementing microservices. |
| **`minecraft-bukkit-pro`** | Master Minecraft server plugin development with Bukkit, Spigot, and |
| **`ml-engineer`** | Build production ML systems with PyTorch 2.x, TensorFlow, and |
| **`ml-pipeline-workflow`** | Build end-to-end MLOps pipelines from data preparation through model training, validation, and production deployment. Use when creating ML pipelines, implementing MLOps practices, or automating model training and deployment workflows. |
| **`mlops-engineer`** | Build comprehensive ML pipelines, experiment tracking, and model |
| **`mobile-developer`** | Develop React Native, Flutter, or native mobile apps with modern |
| **`mobile-security-coder`** | Expert in secure mobile coding practices specializing in input |
| **`modern-javascript-patterns`** | Master ES6+ features including async/await, destructuring, spread operators, arrow functions, promises, modules, iterators, generators, and functional programming patterns for writing clean, efficient JavaScript code. Use when refactoring legacy code, implementing modern patterns, or optimizing JavaScript applications. |
| **`monorepo-architect`** | Expert in monorepo architecture, build systems, and dependency management at scale. Masters Nx, Turborepo, Bazel, and Lerna for efficient multi-project development. Use PROACTIVELY for monorepo setup, |
| **`monorepo-management`** | Master monorepo management with Turborepo, Nx, and pnpm workspaces to build efficient, scalable multi-package repositories with optimized builds and dependency management. Use when setting up monorepos, optimizing builds, or managing shared dependencies. |
| **`mtls-configuration`** | Configure mutual TLS (mTLS) for zero-trust service-to-service communication. Use when implementing zero-trust networking, certificate management, or securing internal service communication. |
| **`multi-cloud-architecture`** | Design multi-cloud architectures using a decision framework to select and integrate services across AWS, Azure, and GCP. Use when building multi-cloud systems, avoiding vendor lock-in, or leveraging best-of-breed services from multiple providers. |
| **`multi-platform-apps-multi-platform`** | Build and deploy the same feature consistently across web, mobile, and desktop platforms using API-first architecture and parallel implementation strategies. |
| **`network-engineer`** | Expert network engineer specializing in modern cloud networking, |
| **`nextjs-app-router-patterns`** | Master Next.js 14+ App Router with Server Components, streaming, parallel routes, and advanced data fetching. Use when building Next.js applications, implementing SSR/SSG, or optimizing React Server Components. |
| **`nft-standards`** | Implement NFT standards (ERC-721, ERC-1155) with proper metadata handling, minting strategies, and marketplace integration. Use when creating NFT contracts, building NFT marketplaces, or implementing digital asset systems. |
| **`nodejs-backend-patterns`** | Build production-ready Node.js backend services with Express/Fastify, implementing middleware patterns, error handling, authentication, database integration, and API design best practices. Use when creating Node.js servers, REST APIs, GraphQL backends, or microservices architectures. |
| **`observability-engineer`** | Build production-ready monitoring, logging, and tracing systems. |
| **`observability-monitoring-monitor-setup`** | You are a monitoring and observability expert specializing in implementing comprehensive monitoring solutions. Set up metrics collection, distributed tracing, log aggregation, and create insightful da |
| **`observability-monitoring-slo-implement`** | You are an SLO (Service Level Objective) expert specializing in implementing reliability standards and error budget-based practices. Design SLO frameworks, define SLIs, and build monitoring that balances reliability with delivery velocity. |
| **`on-call-handoff-patterns`** | Master on-call shift handoffs with context transfer, escalation procedures, and documentation. Use when transitioning on-call responsibilities, documenting shift summaries, or improving on-call processes. |
| **`openapi-spec-generation`** | Generate and maintain OpenAPI 3.1 specifications from code, design-first specs, and validation patterns. Use when creating API documentation, generating SDKs, or ensuring API contract compliance. |
| **`payment-integration`** | Integrate Stripe, PayPal, and payment processors. Handles checkout |
| **`paypal-integration`** | Integrate PayPal payment processing with support for express checkout, subscriptions, and refund management. Use when implementing PayPal payments, processing online transactions, or building e-commerce checkout flows. |
| **`pci-compliance`** | Implement PCI DSS compliance requirements for secure handling of payment card data and payment systems. Use when securing payment processing, achieving PCI compliance, or implementing payment card security measures. |
| **`performance-engineer`** | Expert performance engineer specializing in modern observability, |
| **`performance-testing-review-multi-agent-review`** | Use when working with performance testing review multi agent review |
| **`php-pro`** | Write idiomatic PHP code with generators, iterators, SPL data |
| **`pm-all`** | Orchestrate full governance scan with prerequisite gates; default noise-filtered summary; rebuild .pm/dashboard aggregate. |
| **`pm-arch`** | Scan project structure and generate Mermaid architecture diagrams + flowcharts under .pm/architecture/. |
| **`pm-charter`** | >- |
| **`pm-discover`** | Deep-scan all enabled governance modules and refresh state (internal; used by pm-all / status --full). |
| **`pm-done`** | Close a todo (TODO-xxx), sync completed.md, refresh overview Top3. |
| **`pm-export`** | >- |
| **`pm-fix`** | Analyze pasted logs/stacks/slow SQL from chat (or --path) into bugs findings and todos. |
| **`pm-init`** | Initialize local .pm governance workbench; detect new vs existing project; discover Spec Kit constitution; optional outline from intent. |
| **`pm-manager`** | Project governance workbench (/pm-*). Use for /pm-init, /pm-status, /pm-next, /pm-done, /pm-fix, /pm-all, /pm-outline, /pm-charter, /pm-export, /pm-arch, project health Top3, pasted logs/stacks, Spec Kit constitution discovery, and local .pm governance. Triggers on project management, governance, what should I do today, help me with this error. |
| **`pm-next`** | >- |
| **`pm-outline`** | >- |
| **`pm-status`** | Show governance health, iteration progress, and today's Top3 actionable todos. Primary daily entry. |
| **`posix-shell-pro`** | Expert in strict POSIX sh scripting for maximum portability across |
| **`postgresql`** | Design a PostgreSQL-specific schema. Covers best-practices, data types, indexing, constraints, performance patterns, and advanced features |
| **`postmortem-writing`** | Write effective blameless postmortems with root cause analysis, timelines, and action items. Use when conducting incident reviews, writing postmortem documents, or improving incident response processes. |
| **`projection-patterns`** | Build read models and projections from event streams. Use when implementing CQRS read sides, building materialized views, or optimizing query performance in event-sourced systems. |
| **`prometheus-configuration`** | Set up Prometheus for comprehensive metric collection, storage, and monitoring of infrastructure and applications. Use when implementing metrics collection, setting up monitoring infrastructure, or configuring alerting systems. |
| **`prompt-engineer`** | Expert prompt engineer specializing in advanced prompting |
| **`prompt-engineering-patterns`** | Master advanced prompt engineering techniques to maximize LLM performance, reliability, and controllability in production. Use when optimizing prompts, improving LLM outputs, or designing production prompt templates. |
| **`protocol-reverse-engineering`** | Master network protocol reverse engineering including packet analysis, protocol dissection, and custom protocol documentation. Use when analyzing network traffic, understanding proprietary protocols, or debugging network communication. |
| **`python-development-python-scaffold`** | You are a Python project architecture expert specializing in scaffolding production-ready Python applications. Generate complete project structures with modern tooling (uv, FastAPI, Django), type hint |
| **`python-packaging`** | Create distributable Python packages with proper project structure, setup.py/pyproject.toml, and publishing to PyPI. Use when packaging Python libraries, creating CLI tools, or distributing Python code. |
| **`python-performance-optimization`** | Profile and optimize Python code using cProfile, memory profilers, and performance best practices. Use when debugging slow Python code, optimizing bottlenecks, or improving application performance. |
| **`python-pro`** | Master Python 3.12+ with modern features, async programming, |
| **`python-testing-patterns`** | Implement comprehensive testing strategies with pytest, fixtures, mocking, and test-driven development. Use when writing Python tests, setting up test suites, or implementing testing best practices. |
| **`quant-analyst`** | Build financial models, backtest trading strategies, and analyze |
| **`rag-implementation`** | Build Retrieval-Augmented Generation (RAG) systems for LLM applications with vector databases and semantic search. Use when implementing knowledge-grounded AI, building document Q&A systems, or integrating LLMs with external knowledge bases. |
| **`react-modernization`** | Upgrade React applications to latest versions, migrate from class components to hooks, and adopt concurrent features. Use when modernizing React codebases, migrating to React Hooks, or upgrading to latest React versions. |
| **`react-native-architecture`** | Build production React Native apps with Expo, navigation, native modules, offline sync, and cross-platform patterns. Use when developing mobile apps, implementing native integrations, or architecting React Native projects. |
| **`react-state-management`** | Master modern React state management with Redux Toolkit, Zustand, Jotai, and React Query. Use when setting up global state, managing server state, or choosing between state management solutions. |
| **`reference-builder`** | Creates exhaustive technical references and API documentation. |
| **`reverse-engineer`** | Expert reverse engineer specializing in binary analysis, |
| **`risk-manager`** | Monitor portfolio risk, R-multiples, and position limits. Creates |
| **`risk-metrics-calculation`** | Calculate portfolio risk metrics including VaR, CVaR, Sharpe, Sortino, and drawdown analysis. Use when measuring portfolio risk, implementing risk limits, or building risk monitoring systems. |
| **`ruby-pro`** | Write idiomatic Ruby code with metaprogramming, Rails patterns, and |
| **`rust-async-patterns`** | Master Rust async programming with Tokio, async traits, error handling, and concurrent patterns. Use when building async Rust applications, implementing concurrent systems, or debugging async code. |
| **`rust-pro`** | Master Rust 1.75+ with modern async patterns, advanced type system |
| **`saga-orchestration`** | Implement saga patterns for distributed transactions and cross-aggregate workflows. Use when coordinating multi-step business processes, handling compensating transactions, or managing long-running workflows. |
| **`sales-automator`** | Draft cold emails, follow-ups, and proposal templates. Creates |
| **`sast-configuration`** | Configure Static Application Security Testing (SAST) tools for automated vulnerability detection in application code. Use when setting up security scanning, implementing DevSecOps practices, or automating code vulnerability detection. |
| **`scala-pro`** | Master enterprise-grade Scala development with functional |
| **`screen-reader-testing`** | Test web applications with screen readers including VoiceOver, NVDA, and JAWS. Use when validating screen reader compatibility, debugging accessibility issues, or ensuring assistive technology support. |
| **`search-specialist`** | Expert web researcher using advanced search techniques and |
| **`security-auditor`** | Expert security auditor specializing in DevSecOps, comprehensive |
| **`security-compliance-compliance-check`** | You are a compliance expert specializing in regulatory requirements for software systems including GDPR, HIPAA, SOC2, PCI-DSS, and other industry standards. Perform compliance audits and provide implementation guidance. |
| **`security-requirement-extraction`** | Derive security requirements from threat models and business context. Use when translating threats into actionable requirements, creating security user stories, or building security test cases. |
| **`security-scanning-security-dependencies`** | You are a security expert specializing in dependency vulnerability analysis, SBOM generation, and supply chain security. Scan project dependencies across ecosystems to identify vulnerabilities, assess risks, and recommend remediation. |
| **`security-scanning-security-hardening`** | Coordinate multi-layer security scanning and hardening across application, infrastructure, and compliance controls. |
| **`seo-authority-builder`** | Analyzes content for E-E-A-T signals and suggests improvements to |
| **`seo-cannibalization-detector`** | Analyzes multiple provided pages to identify keyword overlap and |
| **`seo-content-auditor`** | Analyzes provided content for quality, E-E-A-T signals, and SEO |
| **`seo-content-planner`** | Creates comprehensive content outlines and topic clusters for SEO. |
| **`seo-content-refresher`** | Identifies outdated elements in provided content and suggests |
| **`seo-content-writer`** | Writes SEO-optimized content based on provided keywords and topic |
| **`seo-keyword-strategist`** | Analyzes keyword usage in provided content, calculates density, |
| **`seo-meta-optimizer`** | Creates optimized meta titles, descriptions, and URL suggestions |
| **`seo-snippet-hunter`** | Formats content to be eligible for featured snippets and SERP |
| **`seo-structure-architect`** | Analyzes and optimizes content structure including header |
| **`service-mesh-expert`** | Expert service mesh architect specializing in Istio, Linkerd, and cloud-native networking patterns. Masters traffic management, security policies, observability integration, and multi-cluster mesh con |
| **`service-mesh-observability`** | Implement comprehensive observability for service meshes including distributed tracing, metrics, and visualization. Use when setting up mesh monitoring, debugging latency issues, or implementing SLOs for service communication. |
| **`similarity-search-patterns`** | Implement efficient similarity search with vector databases. Use when building semantic search, implementing nearest neighbor queries, or optimizing retrieval performance. |
| **`slo-implementation`** | Define and implement Service Level Indicators (SLIs) and Service Level Objectives (SLOs) with error budgets and alerting. Use when establishing reliability targets, implementing SRE practices, or measuring service performance. |
| **`solidity-security`** | Master smart contract security best practices to prevent common vulnerabilities and implement secure Solidity patterns. Use when writing smart contracts, auditing existing contracts, or implementing security measures for blockchain applications. |
| **`spark-optimization`** | Optimize Apache Spark jobs with partitioning, caching, shuffle optimization, and memory tuning. Use when improving Spark performance, debugging slow jobs, or scaling data processing pipelines. |
| **`sql-optimization-patterns`** | Master SQL query optimization, indexing strategies, and EXPLAIN analysis to dramatically improve database performance and eliminate slow queries. Use when debugging slow queries, designing database schemas, or optimizing application performance. |
| **`sql-pro`** | Master modern SQL with cloud-native databases, OLTP/OLAP |
| **`startup-analyst`** | Expert startup business analyst specializing in market sizing, |
| **`startup-business-analyst-business-case`** | Generate comprehensive investor-ready business case document with |
| **`startup-business-analyst-financial-projections`** | Create detailed 3-5 year financial model with revenue, costs, cash |
| **`startup-business-analyst-market-opportunity`** | Generate comprehensive market opportunity analysis with TAM/SAM/SOM |
| **`startup-financial-modeling`** | This skill should be used when the user asks to "create financial |
| **`startup-metrics-framework`** | This skill should be used when the user asks about "key startup |
| **`stride-analysis-patterns`** | Apply STRIDE methodology to systematically identify threats. Use when analyzing system security, conducting threat modeling sessions, or creating security documentation. |
| **`stripe-integration`** | Implement Stripe payment processing for robust, PCI-compliant payment flows including checkout, subscriptions, and webhooks. Use when integrating Stripe payments, building subscription systems, or implementing secure checkout flows. |
| **`supabase`** | Use when doing ANY task involving Supabase. Triggers: Supabase products (Database, Auth, Edge Functions, Realtime, Storage, Vectors, Cron, Queues); client libraries and SSR integrations (supabase-js, @supabase/ssr) in Next.js, React, SvelteKit, Astro, Remix; auth issues (login, logout, sessions, JWT, cookies, getSession, getUser, getClaims, RLS); Supabase CLI or MCP server; schema changes, migrations, declarative schemas, security audits, Postgres extensions (pg_graphql, pg_cron, pg_vector). |
| **`supabase-postgres-best-practices`** | Postgres performance optimization and best practices from Supabase. Use this skill when writing, reviewing, or optimizing Postgres queries, schema designs, or database configurations. |
| **`systems-programming-rust-project`** | You are a Rust project architecture expert specializing in scaffolding production-ready Rust applications. Generate complete project structures with cargo tooling, proper module organization, testing |
| **`tailwind-design-system`** | Build scalable design systems with Tailwind CSS, design tokens, component libraries, and responsive patterns. Use when creating component libraries, implementing design systems, or standardizing UI patterns. |
| **`tdd-orchestrator`** | Master TDD orchestrator specializing in red-green-refactor |
| **`tdd-workflows-tdd-cycle`** | Use when working with tdd workflows tdd cycle |
| **`tdd-workflows-tdd-green`** | Implement the minimal code needed to make failing tests pass in the TDD green phase. |
| **`tdd-workflows-tdd-red`** | Generate failing tests for the TDD red phase to define expected behavior and edge cases. |
| **`tdd-workflows-tdd-refactor`** | Use when working with tdd workflows tdd refactor |
| **`team-collaboration-issue`** | You are a GitHub issue resolution expert specializing in systematic bug investigation, feature implementation, and collaborative development workflows. Your expertise spans issue triage, root cause an |
| **`team-collaboration-standup-notes`** | You are an expert team communication specialist focused on async-first standup practices, AI-assisted note generation from commit history, and effective remote team coordination patterns. |
| **`team-composition-analysis`** | This skill should be used when the user asks to "plan team |
| **`temporal-python-pro`** | Master Temporal workflow orchestration with Python SDK. Implements |
| **`temporal-python-testing`** | Test Temporal workflows with pytest, time-skipping, and mocking strategies. Covers unit testing, integration testing, replay testing, and local development setup. Use when implementing Temporal workflow tests or debugging test failures. |
| **`terraform-module-library`** | Build reusable Terraform modules for AWS, Azure, and GCP infrastructure following infrastructure-as-code best practices. Use when creating infrastructure modules, standardizing cloud provisioning, or implementing reusable IaC components. |
| **`terraform-specialist`** | Expert Terraform/OpenTofu specialist mastering advanced IaC |
| **`test-automator`** | Master AI-powered test automation with modern frameworks, |
| **`test-guard`** | Review generated or changed test code against universal testing rules before it ships. Best used reactively after an agent writes, edits, generates, or refactors tests, before presenting, committing, or merging them. Use for pytest (test_*.py, *_test.py), PHPUnit/Pest (*Test.php), Jest/Vitest (*.test.ts, *.spec.js), Go (*_test.go), files under tests/, __tests__/, or spec/, and review requests like 'write tests for X', 'add tests', 'test this', 'review these tests', or PR diffs containing tests. Can also guide test writing when explicitly invoked before the work. This skill is the quality gate that prevents AI-generated test bloat. DO NOT USE for production or implementation code review (use clean-code-guard), CI or test-runner configuration, running or debugging tests, or general architecture discussion. |
| **`threat-mitigation-mapping`** | Map identified threats to appropriate security controls and mitigations. Use when prioritizing security investments, creating remediation plans, or validating control effectiveness. |
| **`threat-modeling-expert`** | Expert in threat modeling methodologies, security architecture review, and risk assessment. Masters STRIDE, PASTA, attack trees, and security requirement extraction. Use for security architecture reviews, threat identification, and secure-by-design planning. |
| **`track-management`** | Use this skill when creating, managing, or working with Conductor |
| **`tutorial-engineer`** | Creates step-by-step tutorials and educational content from code. |
| **`typescript-advanced-types`** | Master TypeScript's advanced type system including generics, conditional types, mapped types, template literals, and utility types for building type-safe applications. Use when implementing complex type logic, creating reusable type utilities, or ensuring compile-time type safety in TypeScript projects. |
| **`typescript-pro`** | Master TypeScript with advanced types, generics, and strict type |
| **`ui-ux-designer`** | Create interface designs, wireframes, and design systems. Masters |
| **`ui-visual-validator`** | Rigorous visual validation expert specializing in UI testing, |
| **`uiux-designer`** | Use this skill when designing UI components, choosing color palettes, implementing responsive layouts, or reviewing code for UX issues. For landing pages, dashboards, e-commerce, SaaS, and mobile apps. Provides 50+ design styles, 97 color palettes, 57 font pairings, and stack-specific guidelines for React, Vue, Next.js, Flutter, SwiftUI, and more. |
| **`unit-testing-test-generate`** | Generate comprehensive, maintainable unit tests across languages with strong coverage and edge case focus. |
| **`unity-developer`** | Build Unity games with optimized C# scripts, efficient rendering, |
| **`unity-ecs-patterns`** | Master Unity ECS (Entity Component System) with DOTS, Jobs, and Burst for high-performance game development. Use when building data-oriented games, optimizing performance, or working with large entity counts. |
| **`uv-package-manager`** | Master the uv package manager for fast Python dependency management, virtual environments, and modern Python project workflows. Use when setting up Python projects, managing dependencies, or optimizing Python development workflows with uv. |
| **`vector-database-engineer`** | Expert in vector databases, embedding strategies, and semantic search implementation. Masters Pinecone, Weaviate, Qdrant, Milvus, and pgvector for RAG applications, recommendation systems, and similar |
| **`vector-index-tuning`** | Optimize vector index performance for latency, recall, and memory. Use when tuning HNSW parameters, selecting quantization strategies, or scaling vector search infrastructure. |
| **`wcag-audit-patterns`** | Conduct WCAG 2.2 accessibility audits with automated testing, manual verification, and remediation guidance. Use when auditing websites for accessibility, fixing WCAG violations, or implementing accessible design patterns. |
| **`woo-guard`** | Review generated or changed WooCommerce code — extensions, payment and shipping integrations, checkout customizations, and order/product logic — before it ships. Best used reactively after an agent writes, edits, or reviews code touching WooCommerce APIs: wc_get_order, wc_get_orders, wc_get_product, WC() cart or session, woocommerce_* hooks, Store API endpoints, payment gateways, order or product meta, HPOS, subscriptions, or bookings. Use on 'review this Woo plugin', 'is this HPOS compatible', or after tasks like 'write a WooCommerce extension', 'add a checkout field', 'hook into the order flow', or 'update stock'. Enforces HPOS-safe order access, CRUD over direct meta, feature-compatibility declarations, server-side checkout validation, money-handling discipline, and hooks over template overrides. DO NOT USE for WordPress code without WooCommerce APIs (use wp-guard), generic code review (use clean-code-guard), test review (use test-guard), or store configuration and admin-screen questions. |
| **`workflow-orchestration-patterns`** | Design durable workflows with Temporal for distributed systems. Covers workflow vs activity separation, saga patterns, state management, and determinism constraints. Use when building long-running processes, distributed transactions, or microservice orchestration. |
| **`workflow-patterns`** | Use this skill when implementing tasks according to Conductor's TDD |
| **`wp-guard`** | Review generated or changed WordPress code — plugins, themes, and blocks — before it ships. Best used reactively after an agent writes, edits, or reviews code touching WordPress APIs: add_action/add_filter, shortcodes, meta boxes, AJAX handlers, REST routes, WP_Query or $wpdb, widgets, or WP-CLI commands. Use on 'review this plugin', 'is this safe to ship', 'make this translatable', 'speed up this query', or after tasks like 'write a plugin' or 'add an endpoint/shortcode/meta box'. Enforces escaping and sanitization, nonces plus capability checks, prepared database queries, core-API-first development, translation-ready strings, and query/caching discipline. DO NOT USE for WooCommerce-specific order, product, or checkout logic (use woo-guard), non-WordPress PHP, generic code quality review (use clean-code-guard), test code review (use test-guard), server or hosting configuration, or conceptual WordPress questions. |
