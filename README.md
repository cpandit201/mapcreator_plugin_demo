- On macs; run python -m SimpleHTTPServer 7000 to start development server
- Goto http://localhost:7000 to check your application is deployed
- Run following in mapcreator console
```
nmc.utils.registerDevPlugin("TEST_PLUGIN_STUDIO_LOCAL", 'http://127.0.0.1:7000/test_local.js', {})
```