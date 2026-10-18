import modelo from './modelo-gpa.json';

/**
 * Estimativa do GPA (escala 0 a 4) com o modelo Ridge treinado no repositório PISI3.
 * Roda no aparelho: nenhum dado sai do celular. Os números do modelo estão em modelo-gpa.json
 * (gerado por analysis/exportar_modelo_gpa.py no repositório de análise).
 *
 * Atenção: o modelo foi treinado com um conjunto global de 10 mil estudantes, não com dados
 * da UFRPE. A estimativa é indicativa e não deve ser usada para decisões sobre o estudante.
 */

export interface EntradasPrevisao {
  /** Horas de estudo fora da sala por dia. */
  estudoHoras: number;
  /** Horas de sono por noite. */
  sonoHoras: number;
  /** Estresse na escala do modelo (1 a 9). Use `estresseDoDiario` para converter o registro de 1 a 5. */
  estresse: number;
  /** Frequência nas aulas, em porcentagem (0 a 100). */
  frequencia: number;
  /** Horas por dia em redes sociais. */
  redesHoras: number;
  /** Idade em anos. */
  idade: number;
}

export interface ResultadoPrevisao {
  gpa: number;
  perfil: string;
}

/** Converte o estresse do Diário (1 a 5) para a escala do modelo (1 a 9), linearmente. */
export function estresseDoDiario(estresse: number): number {
  return 1 + (Math.min(5, Math.max(1, estresse)) - 1) * 2;
}

export function preverGpa(entradas: EntradasPrevisao): ResultadoPrevisao {
  const valores: Record<string, number> = {
    study_hours_per_day: entradas.estudoHoras,
    sleep_hours: entradas.sonoHoras,
    mental_stress_level: entradas.estresse,
    class_attendance_percent: entradas.frequencia,
    social_media_hours: entradas.redesHoras,
    age: entradas.idade,
  };

  // 1) Perfil comportamental: vizinho mais próximo entre os centróides (como o K-Means faz)
  const z = modelo.perfis.habitos.map((c, i) => (valores[c] - modelo.perfis.media[i]) / modelo.perfis.escala[i]);
  let melhor = 0;
  let menorDistancia = Infinity;
  modelo.perfis.centroides.forEach((centroide, i) => {
    const distancia = centroide.reduce((soma, c, j) => soma + (z[j] - c) ** 2, 0);
    if (distancia < menorDistancia) {
      menorDistancia = distancia;
      melhor = i;
    }
  });
  const perfil = modelo.perfis.nomes[melhor];

  // 2) Regressão Ridge: intercepto + coeficientes sobre as variáveis padronizadas + perfil
  let soma = modelo.intercepto;
  modelo.features_numericas.forEach((nome, i) => {
    const zi = (valores[nome] - modelo.media[i]) / modelo.escala[i];
    soma += modelo.coef_numericos[i] * zi;
  });
  modelo.categorias.forEach((categoria, i) => {
    if (categoria === perfil) soma += modelo.coef_categoricos[i];
  });

  return { gpa: Math.min(4, Math.max(0, soma)), perfil };
}
