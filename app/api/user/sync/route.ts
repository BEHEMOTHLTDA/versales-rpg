// src/app/api/user/sync/route.ts

import { type NextRequest, NextResponse } from 'next/server';
import admin from 'firebase-admin';
import { supabase } from '@/lib/supabase/client';

// LOG 1: Verificando se a variável de ambiente está sendo lida.
console.log('API Route loaded. Checking for ENV variable...');
if (!process.env.FIREBASE_ADMIN_SDK_CONFIG) {
  console.error('FATAL: FIREBASE_ADMIN_SDK_CONFIG não foi encontrada!');
}

const serviceAccount = JSON.parse(
  process.env.FIREBASE_ADMIN_SDK_CONFIG as string
);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log('Firebase Admin SDK inicializado.');
}

export async function POST(request: NextRequest) {
  console.log('API /api/user/sync chamada com método POST.');
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      console.error('Erro na requisição: ID token não fornecido.');
      return NextResponse.json({ error: 'ID token não fornecido' }, { status: 400 });
    }
    console.log('ID Token recebido. Verificando com o Firebase...');

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    console.log('Token verificado com sucesso. UID:', decodedToken.uid);

    const { uid, email } = decodedToken;

    console.log(`Tentando inserir/atualizar perfil para o usuário ${uid} no Supabase.`);
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: uid,
        username: email?.split('@')[0] || `user_${uid.substring(0, 8)}`,
        email: email,
      })
      .select()
      .single();

    if (error) {
      throw error; // Joga o erro para o bloco catch
    }

    console.log('Perfil sincronizado com sucesso no Supabase:', data);
    return NextResponse.json({ message: 'Usuário sincronizado com sucesso', user: data });

  } catch (error: any) {
    // LOG FINAL: Este é o log de erro que precisamos ver!
    console.error('ERRO CRÍTICO NA API DE SINCRONIZAÇÃO:', error.message);
    return NextResponse.json({ error: 'Falha na autenticação do servidor', details: error.message }, { status: 500 });
  }
}