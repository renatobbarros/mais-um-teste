/**
 * Lembretes de prazo no celular (notificações locais, sem servidor).
 * A cada mudança nas atividades, os lembretes antigos saem e os novos são agendados.
 */
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

import { calcularLembretes } from './lembretesLogica';
import type { Atividade } from './types';

export const lembretesDisponiveis = true;

const CANAL = 'prazos';

// Mostra o lembrete mesmo com o app aberto
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function prepararCanal() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CANAL, {
      name: 'Prazos',
      importance: Notifications.AndroidImportance.HIGH,
    });
  }
}

/** Pede permissão ao usuário (se ainda não foi dada). Devolve true quando os lembretes podem funcionar. */
export async function pedirPermissaoLembretes(): Promise<boolean> {
  try {
    await prepararCanal();
    const atual = await Notifications.getPermissionsAsync();
    if (atual.granted) return true;
    if (!atual.canAskAgain) return false;
    const nova = await Notifications.requestPermissionsAsync();
    return nova.granted;
  } catch {
    return false;
  }
}

export async function cancelarLembretes(): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch {
    // sem permissão ou sem suporte: nada a cancelar
  }
}

/** Troca os lembretes agendados pelos das atividades pendentes. Devolve quantos foram agendados. */
export async function agendarLembretes(atividades: Atividade[]): Promise<number> {
  try {
    await prepararCanal();
    await Notifications.cancelAllScheduledNotificationsAsync();
    const lembretes = calcularLembretes(atividades);
    for (const l of lembretes) {
      await Notifications.scheduleNotificationAsync({
        content: { title: l.titulo, body: l.corpo },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: l.quando,
          channelId: CANAL,
        },
      });
    }
    return lembretes.length;
  } catch {
    return 0;
  }
}
