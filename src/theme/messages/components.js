module.exports = {
  name: 'Components Messages',
  themeComponentsMessages: {
    header: {
      sitename: 'SIMPLON POINT',
    },
    errors: {
      default: 'Une erreur est survenue. Veuillez réessayer.',
      validation: {
        required: 'Ce champ est requis.',
        email: 'Veuillez entrer une adresse e-mail valide.',
        minLength: (min) => `Ce champ doit comporter au moins ${min} caractères.`,
      },
      server: 'Une erreur de serveur est survenue. Veuillez réessayer plus tard.',
    },
    success: {
      default: 'Opération réussie!',
    },
    info: {
      default: 'Information importante à noter.',
    },
    themeComponentsMessages: {
      form: {
        typeRequired: 'Veuillez sélectionner un type de congé.',
        dateDebutRequired: 'Veuillez sélectionner une date de début.',
        dateFinRequired: 'Veuillez sélectionner une date de fin.',
        successTitle: 'Demande de congé envoyée.',
        successDescription: "Votre demande est en attente d'approbation.",
      },
      errors: {
        default: 'Erreur',
        submissionError: "Une erreur est survenue lors de l'envoi de la demande.",
      },
    },
  },
};
