import { ExerciseItem } from '../types/index';

export const exercisesList: ExerciseItem[] = [
  {
    id: 'chair_squat',
    name: 'Chair / Box Squat',
    category: 'lower',
    targetMuscles: ['Quadriceps', 'Glutes', 'Hamstrings'],
    jointFriendly: true,
    kneeSafetyTip:
      'Gunakan kursi stabil di belakang. Dorong pinggul ke belakang terlebih dahulu, bukan memajukan lutut. Sentuh kursi pelan lalu berdiri tegak kembali.',
    formCues: [
      'Kaki selebar bahu, ujung jari kaki sedikit mengarah ke luar (~15 derajat)',
      'Tarik napas saat menurunkan pinggul ke arah kursi dengan tempo terkontrol',
      'Sentuh ujung kursi tanpa menghempaskan bobot badan',
      'Buang napas dan tekan tumit ke lantai untuk kembali berdiri tegak',
    ],
    defaultWorkDurationSeconds: 30,
    defaultRestDurationSeconds: 20,
    defaultReps: 12,
  },
  {
    id: 'incline_pushup',
    name: 'Incline Push-Up (Meja / Kursi Kuat)',
    category: 'upper',
    targetMuscles: ['Chest', 'Triceps', 'Shoulders', 'Core'],
    jointFriendly: true,
    kneeSafetyTip:
      'Tumpuan tangan yang lebih tinggi mengurangi tekanan pada bahu dan pergelangan tangan, cocok untuk membangun kekuatan awal.',
    formCues: [
      'Letakkan tangan di tepi meja atau permukaan kokoh, selebar bahu',
      'Tubuh lurus sempurna dari kepala hingga tumit seperti papan (plank)',
      'Turunkan dada perlahan hingga hampir menyentuh meja',
      'Dorong kuat kembali ke posisi awal tanpa mengunci siku terlalu keras',
    ],
    defaultWorkDurationSeconds: 30,
    defaultRestDurationSeconds: 20,
    defaultReps: 10,
  },
  {
    id: 'glute_bridge',
    name: 'Glute Bridge (Jembatan Panggul)',
    category: 'lower',
    targetMuscles: ['Glutes', 'Hamstrings', 'Lower Back'],
    jointFriendly: true,
    kneeSafetyTip:
      'Sangat ramah sendi lutut! Mengaktifkan otot penopang lutut tanpa memberikan beban kompresi aksial.',
    formCues: [
      'Berbaring telentang dengan lutut ditekuk, telapak kaki menapak lantai',
      'Kencangkan perut dan tekan tumit untuk mengangkat panggul ke atas',
      'Tahan 1-2 detik di puncak hingga tubuh membentuk garis lurus dari bahu ke lutut',
      'Turunkan panggul perlahan tanpa langsung menyentuh lantai',
    ],
    defaultWorkDurationSeconds: 35,
    defaultRestDurationSeconds: 15,
    defaultReps: 15,
  },
  {
    id: 'forearm_plank',
    name: 'Forearm Plank',
    category: 'core',
    targetMuscles: ['Abs / Core', 'Transverse Abdominis', 'Shoulders'],
    jointFriendly: true,
    kneeSafetyTip:
      'Jika pinggang bawah terasa pegal, letakkan lutut di lantai (knee plank) untuk menjaga keselamatan tulang belakang.',
    formCues: [
      'Bertumpu pada kedua lengan bawah, siku sejajar tepat di bawah bahu',
      'Kunci otot perut dan bokong kencang-kencang, jangan biarkan pinggul melorot',
      'Pandangan mata rileks ke lantai, leher lurus netral',
      'Bernapas konstan dan teratur, jangan menahan napas',
    ],
    defaultWorkDurationSeconds: 30,
    defaultRestDurationSeconds: 20,
  },
  {
    id: 'dead_bug',
    name: 'Dead Bug (Stabilitas Core)',
    category: 'core',
    targetMuscles: ['Deep Core', 'Pelvic Floor', 'Coordination'],
    jointFriendly: true,
    kneeSafetyTip:
      'Nol beban pada lutut dan menjaga punggung bawah menempel kuat di matras sepanjang gerakan.',
    formCues: [
      'Berbaring telentang, angkat kedua tangan lurus ke atas dan tekuk lutut 90 derajat',
      'Punggung bawah WAJIB menempel rata di lantai (tidak ada celah berlubang)',
      'Turunkan tangan kanan dan kaki kiri secara bersamaan perlahan',
      'Kembali ke posisi awal, lalu ganti sisi berlawanan',
    ],
    defaultWorkDurationSeconds: 35,
    defaultRestDurationSeconds: 15,
    defaultReps: 12,
  },
  {
    id: 'step_jacks',
    name: 'Step Jacks (Low-Impact Cardio)',
    category: 'cardio',
    targetMuscles: ['Full Body', 'Cardiovascular System', 'Shoulders'],
    jointFriendly: true,
    kneeSafetyTip:
      'Pengganti jumping jacks tanpa loncatan sama sekali. Menggerakkan kaki bergantian ke samping sehingga lutut terbebas dari benturan lantai.',
    formCues: [
      'Berdiri tegak, langkahkan kaki kanan ke samping sambil mengangkat kedua tangan ke atas',
      'Kembalikan kaki kanan ke tengah bersamaan dengan menurunkan tangan',
      'Langkahkan kaki kiri ke samping dengan gerakan yang sama',
      'Jaga ritme cepat dan stabil untuk memicu pembakaran lemak',
    ],
    defaultWorkDurationSeconds: 40,
    defaultRestDurationSeconds: 20,
  },
  {
    id: 'wall_sit',
    name: 'Wall Sit (Isometrik Dinding)',
    category: 'lower',
    targetMuscles: ['Quadriceps', 'Calves', 'Endurance'],
    jointFriendly: true,
    kneeSafetyTip:
      'Pastikan lutut tidak melebihi ujung jari kaki (sudut lutut 90-100 derajat). Punggung menempel penuh pada dinding.',
    formCues: [
      'Sandarkan punggung lurus pada dinding yang kokoh',
      'Geser kaki ke depan dan turunkan badan hingga paha hampir sejajar lantai',
      'Tahan posisi diam ini dengan menekan kaki ke lantai',
      'Bernapas dalam dan tenang',
    ],
    defaultWorkDurationSeconds: 30,
    defaultRestDurationSeconds: 20,
  },
  {
    id: 'bird_dog',
    name: 'Bird Dog (Punggung & Bokong)',
    category: 'core',
    targetMuscles: ['Erector Spinae', 'Glutes', 'Shoulders'],
    jointFriendly: true,
    kneeSafetyTip:
      'Gunakan matras empuk di bawah lutut untuk kenyamanan tumpuan.',
    formCues: [
      'Posisi merangkak di lantai, pergelangan tangan di bawah bahu dan lutut di bawah pinggul',
      'Luruskan tangan kanan ke depan dan kaki kiri ke belakang secara bersamaan',
      'Jaga panggul tetap sejajar datar dengan lantai (jangan miring)',
      'Tahan 2 detik, kembali perlahan, dan ulangi sisi sebaliknya',
    ],
    defaultWorkDurationSeconds: 35,
    defaultRestDurationSeconds: 15,
    defaultReps: 12,
  },
];

export function getExerciseById(id: string): ExerciseItem | undefined {
  return exercisesList.find((ex) => ex.id === id);
}
