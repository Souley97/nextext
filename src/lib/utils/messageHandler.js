import messages from '../../theme/messages/components';

export const getMessage = (type, context, params = {}) => {
  // Vérifie si le type de message existe
  if (messages.themeComponentsMessages[type]) {
    // Vérifie si le contexte existe et est une fonction pour le traitement des paramètres
    if (messages.themeComponentsMessages[type][context]) {
      const message = messages.themeComponentsMessages[type][context];

      // Si c'est une fonction, l'appeler avec les paramètres
      return typeof message === 'function' ? message(params) : message;
    }
    // Retourne le message par défaut si le contexte n'existe pas
    return messages.themeComponentsMessages[type].default;
  }
  // Retourne le message d'erreur par défaut si le type n'existe pas
  return messages.themeComponentsMessages.errors.default;
};
