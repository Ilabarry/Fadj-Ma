<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;

class Authenticate extends Middleware
{
    /**
     * Détermine le chemin vers lequel rediriger si non authentifié.
     * Pour une API JSON, retourne directement une erreur 401.
     */
    protected function redirectTo(Request $request): ?string
    {
        // Si la requête attend du JSON, on ne redirige pas mais renvoie null
        return $request->expectsJson() ? null : route('login');
    }

    /**
     * Gère la réponse lorsqu'un utilisateur n'est pas authentifié.
     */
    protected function unauthenticated($request, array $guards)
    {
        // Si la requête attend du JSON, renvoyer une réponse JSON 401
        if ($request->expectsJson()) {
            abort(response()->json([
                'message' => 'Non authentifié.'
            ], 401));
        }

        // Sinon, comportement par défaut (redirection vers login)
        parent::unauthenticated($request, $guards);
    }
}
