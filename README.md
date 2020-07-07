# PerunWebApps

This repository contains Perun web applications.

## Admin gui

Command to serve the admin gui:
```shell script
ng serve admin-gui --public-host=http://localhost:4200 --disable-host-check
```

## Consolidator

Command to serve the consolidator:

```shell script
ng serve consolidator --disable-host-check --baseHref=/krb/nic/ --deployUrl=/krb/nic/ --publicHost=localhost:4200
```

## Apache config
```
<VirtualHost *:80>

  # AliasMatch ^/apps/establish-vo-form/([^/]+)/ /home/vectoun/git/perun/perun-apps/apps/establish-vo-form/
  
  Alias /apps/user-profile/non/ /home/vectoun/git/perun/perun-apps/apps/user-profile/
  Alias /apps/user-profile/krb/ /home/vectoun/git/perun/perun-apps/apps/user-profile/
  Alias /apps/user-profile/fed/ /home/vectoun/git/perun/perun-apps/apps/user-profile/

  Alias "/apps/create-vo-demo/non" "/home/vectoun/git/perun/perun-apps/apps/create-vo-demo"
  Alias "/apps/create-vo-demo/krb" "/home/vectoun/git/perun/perun-apps/apps/create-vo-demo"

  # mini-apps non authz files
  <LocationMatch "^/apps/([^/]+)/([^/]+)/([^/]+)$">
    Options FollowSymLinks Indexes Includes ExecCGI
    Require all granted
    AddHandler cgi-script .cgi .pl
  </LocationMatch>

  <Directory "/home/vectoun/git/perun/perun-apps/">
    Require all granted
  </Directory>

  # mini-apps include files (no-authz)
  Alias "/apps-include/" "/home/vectoun/git/perun/perun-apps/apps-include/"
  <Location "/apps-include/">
    Options FollowSymLinks Indexes Includes ExecCGI
    Require all granted
    AddHandler cgi-script .cgi .pl
  </Location>

  # mini-apps fix edugain default page
  <LocationMatch "^/apps/edugain-group/non/$">
    DirectoryIndex help.html
  </LocationMatch>

  ServerAdmin perun@cesnet.cz

  DocumentRoot /var/www/

  ProxyPreserveHost On
  ProxyIOBufferSize 32192

  SSLProxyEngine on

  ErrorLog ${APACHE_LOG_DIR}/error.log

  LogLevel debug

  # 8009 port pro externí tomcat

  RewriteEngine on

  #REWRITE NEW CONSOLIDATOR
  RewriteRule ^/krb/nic/(.*)$ http://localhost:4200/krb/nic/$1 [P,QSA]
  RewriteRule ^/krb/nic/sockjs-node/(.*)$ http://localhost:4200/krb/nic/sockjs-node/$1 [P,QSA]

  #REWRITE NEW GUI
  RewriteCond %{HTTP_HOST} gui-dev\.org [NC]
  RewriteRule ^/$ http://localhost:4200/ [P,QSA]
  RewriteCond %{HTTP_HOST} gui-dev\.org [NC]
  RewriteRule ^/(.*)$ http://localhost:4200/$1 [P,QSA]
  RewriteCond %{HTTP_HOST} gui-dev\.org [NC]
  RewriteRule ^/sockjs-node/(.*)$ http://localhost:4200/sockjs-node/$1 [P,QSA]

  # REWRITE RPC
  RewriteRule /non/rpc/(.*)$ ajp://localhost:8009/perun-rpc/$1 [P,QSA]
  RewriteRule /krb/rpc/(.*)$ ajp://localhost:8009/perun-rpc/$1 [P,QSA]
  RewriteRule /fed/rpc/(.*)$ ajp://localhost:8009/perun-rpc/$1 [P,QSA]
  RewriteRule /cert/rpc/(.*)$ ajp://localhost:8009/perun-rpc/$1 [P,QSA]
  RewriteRule /oauth/rpc/(.*)$ ajp://localhost:8009/perun-rpc/$1 [P,QSA]
  # POZOR, v rewritech běží každá aplikace na vlastním portu, aby mohly běžet zarás !!

  # REWRITE GUI
  RewriteRule ^/gui/$ /krb/gui/ [R,QSA]
  RewriteRule ^/gui/(.*)$ /krb/gui/$1 [R,QSA]
  RewriteRule ^/(.*)/gui/$ http://127.0.0.1:8889/PerunWeb.html [P,QSA]
  RewriteRule ^/(.*)/gui/(.*)$ http://127.0.0.1:8889/$2 [P,QSA]

  # REWRITE CABINET
  RewriteRule ^/cabinet/$ /krb/cabinet/ [R,QSA]
  RewriteRule ^/cabinet/(.*)$ /krb/cabinet/$1 [R,QSA]
  RewriteRule ^/(.*)/cabinet/$ http://127.0.0.1:8892/PerunCabinet.html [P,QSA]
  RewriteRule ^/(.*)/cabinet/(.*)$ http://127.0.0.1:8892/$2 [P,QSA]

  # REWRITE PWD-RESET
  RewriteRule ^/pwd-reset/$ /krb/pwd-reset/ [R,QSA]
  RewriteRule ^/pwd-reset/(.*)$ /krb/pwd-reset/$1 [R,QSA]
  RewriteRule ^/(.*)/pwd-reset/$ http://127.0.0.1:8891/PerunPwdReset.html [P,QSA]
  RewriteRule ^/(.*)/pwd-reset/(.*)$ http://127.0.0.1:8891/$2 [P,QSA]

  # REWRITE WUI
  RewriteRule ^/wui/$ /krb/wui/ [R,QSA]
  RewriteRule ^/wui/(.*)$ /krb/wui/$1 [R,QSA]
  RewriteRule ^/(.*)/wui/$ http://127.0.0.1:8888/PerunAdmin.html [P,QSA]
  RewriteRule ^/(.*)/wui/(.*)$ http://127.0.0.1:8888/$2 [P,QSA]

  # REWRITE WUI-PROFILE
  RewriteRule ^/profile/$ /krb/profile/ [R,QSA]
  RewriteRule ^/profile/(.*)$ /krb/profile/$1 [R,QSA]
  RewriteRule ^/(.*)/profile/$ http://127.0.0.1:8885/PerunProfile.html [P,QSA]
  RewriteRule ^/(.*)/profile/$ http://127.0.0.1:8885/PerunProfileElixir.html [P,QSA]
  RewriteRule ^/(.*)/profile/(.*)$ http://127.0.0.1:8885/$2 [P,QSA]

  # REWRITE WUI-REGISTRAR
  RewriteRule ^/registrar/$ /krb/registrar/ [R,QSA]
  RewriteRule ^/registrar/(.*)$ /krb/registrar/$1 [R,QSA]
  RewriteRule ^/(.*)/registrar/$ http://127.0.0.1:8887/PerunRegistrar.html [P,QSA]
  RewriteRule ^/(.*)/registrar/$ http://127.0.0.1:8887/PerunRegistrarMU.html [P,QSA]
  #RewriteRule ^/(.*)/registrar/$ http://127.0.0.1:8887/PerunRegistrarElixir.html [P,QSA]
  RewriteRule ^/(.*)/registrar/(.*)$ http://127.0.0.1:8887/$2 [P,QSA]

  # REWRITE WUI-CONSOLIDATOR
  RewriteRule ^/ic/$ /krb/ic/ [R,QSA]
  RewriteRule ^/ic/(.*)$ /krb/ic/$1 [R,QSA]
  RewriteRule ^/(.*)/ic/$ http://127.0.0.1:8886/PerunConsolidator.html [P,QSA]
  RewriteRule ^/(.*)/ic/$ http://127.0.0.1:8886/PerunConsolidatorMU.html [P,QSA]
  #RewriteRule ^/(.*)/ic/$ http://127.0.0.1:8886/PerunConsolidatorElixir.html [P,QSA]
  RewriteRule ^/(.*)/ic/(.*)$ http://127.0.0.1:8886/$2 [P,QSA]

  # make root redirect to cert-gui
  RewriteRule ^/$ /gui/ [R]

  # protection from proxy attacks
  RewriteRule .* - [E=AJP_APACHE_REQUEST_URI:%{REQUEST_URI}]

  ######## RPC #########

  ## RPC over NON
  <Location "/non/rpc/">
    Options FollowSymLinks
    Order allow,deny
    Allow from all
    Require all granted

    # Fake user
    SetEnvIf _ .* AJP_EXTSOURCE=LOCAL
    SetEnvIf _ .* AJP_EXTSOURCETYPE=cz.metacentrum.perun.core.impl.ExtSourceInternal
    SetEnvIf _ .* AJP_EXTSOURCELOA=0
  </Location>

  <Location "/krb/rpc/">
    Options FollowSymLinks
    Order allow,deny
    Allow from all
    Require all granted

    # Fake user    
    SetEnvIf _ .* AJP_ENV_REMOTE_USER=vectoun@META
    SetEnvIf _ .* AJP_EXTSOURCE=META
    SetEnvIf _ .* AJP_EXTSOURCETYPE=cz.metacentrum.perun.core.impl.ExtSourceKerberos
    SetEnvIf _ .* AJP_EXTSOURCELOA=2
   
    SetEnvIf Referer ^.*identityAuth$ AJP_ENV_REMOTE_USER=newvectoun@META
  </Location>
</VirtualHost>
```
