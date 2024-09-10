import { doc, getDoc } from 'firebase/firestore'; // Certifique-se de importar as funções corretas do Firestore
import { db } from '@/configuracao/config'; // Usar a instância do Firestore que você já configurou

export async function sendAdoptionNotification(animalId: string, interestedUserId: string) {
    try {
        // Obter os dados do animal
        const animalDocRef = doc(db, 'animais', animalId); // Usando a função `doc()` corretamente
        const animalDoc = await getDoc(animalDocRef);
        const ownerId = animalDoc.data()?.ownerId;
        const animalName = animalDoc.data()?.name;

        // Obter os dados do usuário interessado
        const interestedUserDocRef = doc(db, 'usuarios', interestedUserId);
        const interestedUserDoc = await getDoc(interestedUserDocRef);
        const interestedUserName = interestedUserDoc.data()?.nomeCompleto;

        // Obter o token de notificação do dono do animal
        const ownerDocRef = doc(db, 'usuarios', ownerId);
        const ownerDoc = await getDoc(ownerDocRef);
        const ownerToken = ownerDoc.data()?.notificationToken;

        if (!ownerToken) {
            console.log('Dono do animal não possui um token de notificação');
            return;
        }

        // Preparar a mensagem de notificação
        const message = {
            to: ownerToken,
            sound: 'default',
            title: 'Novo pedido de adoção!',
            body: `${interestedUserName} se interessou pelo seu animal}`,
            data: { animalId, interestedUserId }
        };

        // Enviar a notificação usando o Expo Push Notification Service
        await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                host:"exp.host",
                Accept: "application/json",
                "accept-encoding": "gzip, deflate",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(message)
        });
        console.log(ownerToken);
        console.log(JSON.stringify(message));

        console.log('Notificação enviada com sucesso!');
    } catch (error) {
        console.error('Erro ao enviar notificação:', error);
    }
}
