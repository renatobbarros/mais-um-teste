import test from 'node:test';
import assert from 'node:assert/strict';
import { estresseDoDiario, preverGpa } from '../previsao';
import referencias from './modelo-gpa.referencias.json';

test('a previsão no app bate com o pipeline Python em casos do conjunto de teste', () => {
  for (const caso of referencias) {
    const entrada = caso.entrada;
    const r = preverGpa({
      estudoHoras: entrada.study_hours_per_day,
      sonoHoras: entrada.sleep_hours,
      estresse: entrada.mental_stress_level,
      frequencia: entrada.class_attendance_percent,
      redesHoras: entrada.social_media_hours,
      idade: entrada.age,
    });
    assert.ok(Math.abs(r.gpa - caso.esperado) < 1e-6, `esperado ${caso.esperado}, obtido ${r.gpa}`);
    assert.equal(r.perfil, caso.perfil);
  }
});

test('a estimativa fica sempre entre 0 e 4', () => {
  const extremos = [
    { estudoHoras: 0, sonoHoras: 0, estresse: 9, frequencia: 0, redesHoras: 12, idade: 60 },
    { estudoHoras: 12, sonoHoras: 12, estresse: 1, frequencia: 100, redesHoras: 0, idade: 10 },
  ];
  for (const e of extremos) {
    const { gpa } = preverGpa(e);
    assert.ok(gpa >= 0 && gpa <= 4, `fora da faixa: ${gpa}`);
  }
});

test('estresse do diário (1 a 5) é convertido para a escala do modelo (1 a 9)', () => {
  assert.equal(estresseDoDiario(1), 1);
  assert.equal(estresseDoDiario(3), 5);
  assert.equal(estresseDoDiario(5), 9);
  assert.equal(estresseDoDiario(9), 9);
});
