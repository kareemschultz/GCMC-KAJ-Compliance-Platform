# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e2]:
    - generic [ref=e3]:
      - img [ref=e5]
      - text: GCMC & KAJ Platform
    - generic [ref=e9]:
      - generic [ref=e10]:
        - generic [ref=e11]: Admin Login
        - generic [ref=e12]: Enter your credentials to access the dashboard
      - generic [ref=e13]:
        - generic [ref=e14]:
          - generic [ref=e15]:
            - generic [ref=e16]: Email
            - textbox "Email" [active] [ref=e17]:
              - /placeholder: name@gcmc.gy
              - text: invalid-email
          - generic [ref=e18]:
            - generic [ref=e19]: Password
            - textbox "Password" [ref=e20]: password123
        - generic [ref=e21]:
          - button "Sign In" [ref=e22]
          - generic [ref=e23]:
            - link "Forgot password?" [ref=e24] [cursor=pointer]:
              - /url: "#"
            - generic [ref=e29]: Or
            - link "Go to Client Portal Login" [ref=e30] [cursor=pointer]:
              - /url: /portal/login
              - text: Go to Client Portal Login
              - img [ref=e31]
            - 'link "(Demo: Simulate Accept Invite)" [ref=e33] [cursor=pointer]':
              - /url: /invite/accept
  - region "Notifications (F8)":
    - list
  - button "Open Next.js Dev Tools" [ref=e39] [cursor=pointer]:
    - img [ref=e40]
  - alert [ref=e43]
```