import React from 'react';
import { useUserWithRoles } from '../lib/utils/hooks/useUserWithRoles';
import { getUserWithRoles } from '../lib/utils/checkRole';

const ApprenantPage = () => {
  const { user, roles } = useUserWithRoles(['Apprenant']); // Spécifie ici les rôles requis

  if (!user) {
    return <p>Chargement...</p>;
  }

  return (
    <div>
      <h1>Bienvenue, {user.nom}</h1>
      <p>Votre adresse e-mail est : {user.email}</p>
      {roles.length > 0 && <p>Vos rôles : {roles.join(', ')}</p>}
    </div>
  );
};

export async function getServerSideProps(context) {
  return await getUserWithRoles(context, ['Apprenant']); // Spécifie ici les rôles requis
}

export default ApprenantPage;
