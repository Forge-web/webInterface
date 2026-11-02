import { sendMessage } from '../../../../kafkaModule/src/producer';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  
  // Отправляе чек в Kafka (в топик raw_receipts)
  await sendMessage('raw_receipts', body);
  
  return { success: true, message: 'Чек отправлен в Kafka' };
}); 