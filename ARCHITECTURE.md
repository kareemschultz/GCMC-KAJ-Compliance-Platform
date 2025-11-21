# System Architecture

## Overview
The GCMC & KAJ Compliance Suite is designed as a modular, component-based application using the Next.js App Router. It follows a **Client-Server** architecture where the frontend (Next.js) interacts with a backend service (currently mocked via `lib/api.ts`, ready for REST/GraphQL integration).

## High-Level Architecture

\`\`\`mermaid
graph TD
    User[User / Staff] -->|HTTPS| CDN[Vercel Edge Network]
    CDN -->|Route Request| App[Next.js App Server]
    
    subgraph "Application Layer"
        App -->|Render| Layout[Root Layout]
        Layout -->|Context| Brand[Brand Context Provider]
        Brand -->|Route| Page[Page Component]
        Page -->|Interact| Components[UI Components]
    end
    
    subgraph "Data Layer (Mock/Real)"
        Components -->|Fetch Data| API[API Abstraction Layer (lib/api.ts)]
        API -->|Query| DB[(Database / Mock Store)]
    end
    
    subgraph "External Services"
        API -.->|Future| Auth[Auth Provider (Clerk/NextAuth)]
        API -.->|Future| Storage[Blob Storage (S3/R2)]
        API -.->|Future| Email[Email Service (Resend)]
    end
\`\`\`

## Module Interaction

The application is divided into two main business domains that share a common core.

\`\`\`mermaid
graph LR
    subgraph "Core Platform"
        Clients[Client Management]
        Docs[Document System]
        Users[User Admin]
        Settings[Configuration]
    end

    subgraph "KAJ (Financial)"
        Filings[Tax Filings]
        Billing[Invoicing]
        Reports[Financial Reports]
    end

    subgraph "GCMC (Consultancy)"
        Training[Training Hub]
        Immigration[Immigration Pipeline]
        Network[Partner Network]
        Paralegal[Legal Docs]
    end

    Clients --> Filings
    Clients --> Immigration
    Clients --> Billing
    
    Docs --> Filings
    Docs --> Paralegal
    
    Users --> Settings
\`\`\`

## Data Flow: Compliance Filing

1.  **Initiation**: User clicks "New Filing" in Dashboard.
2.  **Context**: System checks selected Client ID.
3.  **Form Load**: `NewFilingDropdown` selects the correct form (VAT/NIS).
4.  **Input**: User enters financial data.
5.  **Validation**: Zod schema validates inputs (e.g., VAT calculations).
6.  **Submission**: Data sent to `api.filings.create`.
7.  **Feedback**: Toast notification confirms success; Dashboard refreshes.

## Data Flow: Immigration Case

1.  **Creation**: User opens "New Case" dialog.
2.  **Selection**: Selects Client and Case Type (Visa/Permit).
3.  **State**: Case created with status "To Do".
4.  **Update**: User drags card on Kanban board.
5.  **Persistence**: `onDragEnd` event triggers API update to new status.

## Component Hierarchy (Simplified)

*   `RootLayout`
    *   `ThemeProvider`
    *   `BrandProvider`
        *   `AppSidebar` (Dynamic based on Brand)
        *   `Header`
        *   `MainContent`
            *   `Page` (e.g., `/dashboard`, `/clients/[id]`)
                *   `StatsCards`
                *   `DataTables` / `KanbanBoards`
                *   `ActionDialogs` (Modals)

## Security Considerations

*   **Role-Based Access Control (RBAC)**: UI elements hidden based on user role (Admin vs Staff).
*   **Input Validation**: All forms use `zod` for strict schema validation before submission.
*   **Sanitization**: React automatically escapes content to prevent XSS.
*   **Environment Variables**: Sensitive keys (API tokens) stored in `.env.local` (not committed).
