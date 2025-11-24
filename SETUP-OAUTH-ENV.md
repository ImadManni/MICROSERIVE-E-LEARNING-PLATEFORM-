# Configuration des Variables d'Environnement OAuth2

## Après avoir créé votre OAuth Client ID dans Google Cloud Console

### 1. Trouvez la fenêtre PowerShell de l'Inscription Service

Une fenêtre PowerShell devrait être ouverte avec le titre "Inscription Service" ou afficher "=== Inscription Service ===".

### 2. Dans cette fenêtre, exécutez ces commandes :

```powershell
$env:GOOGLE_CLIENT_ID = "VOTRE_CLIENT_ID_ICI"
$env:GOOGLE_CLIENT_SECRET = "VOTRE_CLIENT_SECRET_ICI"
```

**Remplacez** `VOTRE_CLIENT_ID_ICI` et `VOTRE_CLIENT_SECRET_ICI` par les valeurs réelles de Google Cloud Console.

### 3. Redémarrez le service (si nécessaire)

Si le service est déjà démarré, vous devrez peut-être le redémarrer pour prendre en compte les nouvelles variables :

1. Appuyez sur `Ctrl + C` dans la fenêtre PowerShell de l'Inscription Service
2. Attendez que le service s'arrête
3. Réexécutez :
```powershell
cd "C:\Users\DELL\Desktop\MICROSERVICE E-LEARNING\inscription-service"
$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
$env:JWT_SECRET = "mySecretKeyForJWTTokenGeneration123456789"
$env:GOOGLE_CLIENT_ID = "VOTRE_CLIENT_ID_ICI"
$env:GOOGLE_CLIENT_SECRET = "VOTRE_CLIENT_SECRET_ICI"
mvn spring-boot:run
```

## Configuration YouTube API Key (Statistique Service)

### Dans la fenêtre PowerShell du Statistique Service :

```powershell
$env:YOUTUBE_API_KEY = "VOTRE_YOUTUBE_API_KEY_ICI"
```

Puis redémarrez le service si nécessaire.

## Vérification

### 1. Vérifiez Eureka Dashboard
Ouvrez : http://localhost:8761

Vous devriez voir 5 services enregistrés :
- CONFIG-SERVER
- GATEWAY-SERVICE
- COURS-SERVICE
- INSCRIPTION-SERVICE
- STATISTIQUE-SERVICE

### 2. Testez OAuth2
Ouvrez : http://localhost:8080/oauth2/authorization/google

Vous devriez être redirigé vers la page de connexion Google.

## Dépannage

### Si OAuth2 ne fonctionne pas :

1. **Vérifiez les logs de l'Inscription Service** - Cherchez des erreurs liées à OAuth2
2. **Vérifiez que les variables sont bien définies** :
   ```powershell
   Write-Host "GOOGLE_CLIENT_ID: $env:GOOGLE_CLIENT_ID"
   Write-Host "GOOGLE_CLIENT_SECRET: $env:GOOGLE_CLIENT_SECRET"
   ```
3. **Vérifiez Google Cloud Console** :
   - Authorized JavaScript origins : `http://localhost:3000`
   - Authorized redirect URIs : `http://localhost:8080/login/oauth2/code/google`
4. **Attendez 5 minutes** après avoir modifié les URIs dans Google Cloud Console (propagation)

