export const MESSAGES_KEY = "messages"

const keyFormatter = (idUser, idPartner) => `${MESSAGES_KEY}/${idUser}/${idPartner}`;

export const allUserConversations = (idUser) => `${MESSAGES_KEY}/${idUser}/*`

export default keyFormatter;