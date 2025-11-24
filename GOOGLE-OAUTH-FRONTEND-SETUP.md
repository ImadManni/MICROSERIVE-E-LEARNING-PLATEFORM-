# Configuration Google OAuth2 Frontend (Client-Side)

## Nouvelle Solution - OAuth2 Côté Client

Cette solution utilise Google Identity Services directement dans le frontend, sans passer par le backend Spring Boot.

## Configuration Google Cloud Console

### 1. Créer un OAuth 2.0 Client ID

1. Allez dans [Google Cloud Console](https://console.cloud.google.com/)
2. Sélectionnez votre projet
3. Allez dans **APIs & Services** > **Credentials**
4. Cliquez sur **Create Credentials** > **OAuth client ID**
5. Sélectionnez **Web application**

### 2. Configuration

**Application type:**
```
Web application
```

**Name:**
```
LearnHub Frontend Client
```

**Authorized JavaScript origins:**
```
http://localhost:3000
```

**Authorized redirect URIs:**
```
http://localhost:3000
```

**Note:** Pour la production, ajoutez aussi:
- `https://votre-domaine.com`

### 3. Copier le Client ID

Après création, copiez le **Client ID** (pas le Client Secret, il n'est pas nécessaire pour cette solution).

## Configuration Frontend

### 1. Ajouter le Client ID dans `.env`

Créez ou modifiez le fichier `.env` à la racine du projet :

```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=votre-client-id-ici
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### 2. Redémarrer le serveur de développement

```bash
pnpm dev
```

## Comment ça fonctionne

1. **L'utilisateur clique sur "Continue with Google"**
   - Le composant `GoogleSignInButton` charge Google Identity Services
   - Affiche le bouton Google officiel

2. **L'utilisateur se connecte avec Google**
   - Google authentifie l'utilisateur
   - Retourne un token ID (JWT signé par Google)

3. **Vérification du token**
   - Le frontend vérifie le token avec Google (`tokeninfo` endpoint)
   - Extrait les informations utilisateur (email, nom, etc.)

4. **Création de session**
   - Le frontend envoie le token au backend (optionnel) pour créer un JWT
   - Ou utilise directement le token Google pour l'authentification
   - Stocke le token dans localStorage et cookies

## Avantages de cette solution

✅ **Pas besoin de backend OAuth2** - Tout se passe côté client
✅ **Plus simple** - Pas de configuration complexe dans Spring Boot
✅ **Plus rapide** - Pas de redirections serveur
✅ **Meilleure UX** - Popup Google au lieu de redirection complète
✅ **Sécurisé** - Utilise Google Identity Services officiel

## Dépannage

### Le bouton Google ne s'affiche pas

1. Vérifiez que `NEXT_PUBLIC_GOOGLE_CLIENT_ID` est défini dans `.env`
2. Vérifiez la console du navigateur pour les erreurs
3. Vérifiez que l'origine `http://localhost:3000` est autorisée dans Google Cloud Console

### Erreur "Failed to verify token"

1. Vérifiez votre connexion internet
2. Vérifiez que le token n'a pas expiré
3. Vérifiez les logs de la console

### L'authentification fonctionne mais l'utilisateur n'est pas créé

Le backend doit avoir un endpoint `/auth/google` qui accepte le token Google et crée/utilise l'utilisateur. Si ce endpoint n'existe pas, l'authentification fonctionnera quand même mais l'utilisateur ne sera pas enregistré dans la base de données.

## Endpoint Backend Optionnel

Si vous voulez créer l'utilisateur dans votre base de données, créez cet endpoint dans l'Inscription Service :

```java
@PostMapping("/auth/google")
public ResponseEntity<AuthResponse> loginWithGoogle(@RequestBody Map<String, String> request) {
    String googleToken = request.get("token");
    // Vérifier le token avec Google
    // Créer ou récupérer l'utilisateur
    // Générer un JWT
    // Retourner AuthResponse
}
```

Mais ce n'est **pas obligatoire** - l'authentification fonctionnera sans backend !

