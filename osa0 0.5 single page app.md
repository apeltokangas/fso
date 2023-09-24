```mermaid
sequenceDiagram
    participant browser
    participant server
    
    browser->>server: GET  https://studies.cs.helsinki.fi/exampleapp/spa
    activate server
    server-->>browser: HTML document
    deactivate server

    browser->>server: GET  https://studies.cs.helsinki.fi/exampleapp/main.css
    activate server
    server-->>browser: the css document
    deactivate server

    browser->>server: GET  https://studies.cs.helsinki.fi/exampleapp/spa.js
    activate server
    server-->>browser: the javascript file
    deactivate server

    browser->>server: GET  https://studies.cs.helsinki.fi/exampleapp/data.json
    activate server
    server-->>browser: data
    deactivate server
``` 
