// src/middleware.js
import { NextResponse } from 'next/server';

// Limit the middleware to paths starting with `/api/`
export const config = {
  matcher: '/api/:function*',
};

export async function middleware(req) {
  const url = req.nextUrl.clone();

  // Vérification de l'en-tête 'content-source'
  if (!req.headers.get('content-source')) {
    url.pathname = '/404';
    return NextResponse.redirect(url);
  }

  // Vérification du token d'authentification
  const token = req.headers.get('authorization');
  if (!token) {
    url.pathname = '/login'; // Rediriger vers une page de login si le token est manquant
    return NextResponse.redirect(url);
  }

  // Si toutes les vérifications passent, continuer normalement
  return NextResponse.next();
}
