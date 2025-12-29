export interface Lesson {
  id: number;
  title: string;
  duration: string;
}

export interface Course {
  id: number;
  title: string;
  speaker: string;
  lessons: number;
  duration: string;
  level: string;
  description: string;
  lessonList: Lesson[];
}

const courses: Course[] = [
  {
    id: 101,
    title: "Fundamentals of Tawheed",
    speaker: "Dr. Bilal Philips",
    lessons: 12,
    duration: "6 hours",
    level: "Beginner",
    description: "Learn the fundamental principles of Tawheed (Islamic monotheism) and understand the core beliefs of Islam.",
    lessonList: [
      { id: 1, title: "Introduction to Tawheed", duration: "30 min" },
      { id: 2, title: "Types of Tawheed", duration: "35 min" },
      { id: 3, title: "Tawheed Ar-Rububiyyah", duration: "40 min" },
      { id: 4, title: "Tawheed Al-Uluhiyyah", duration: "45 min" },
      { id: 5, title: "Tawheed Al-Asma wa Sifat", duration: "35 min" },
      { id: 6, title: "Shirk and its Types", duration: "40 min" },
      { id: 7, title: "Minor Shirk", duration: "30 min" },
      { id: 8, title: "Major Shirk", duration: "35 min" },
      { id: 9, title: "Conditions of Tawheed", duration: "40 min" },
      { id: 10, title: "Nullifiers of Tawheed", duration: "35 min" },
      { id: 11, title: "Practical Applications", duration: "30 min" },
      { id: 12, title: "Conclusion and Review", duration: "25 min" },
    ],
  },
  {
    id: 102,
    title: "Arabic for Beginners",
    speaker: "Sheikh Wisam Sharieff",
    lessons: 20,
    duration: "10 hours",
    level: "Beginner",
    description: "Start your journey to learn Arabic with this comprehensive beginner's course.",
    lessonList: Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      title: `Lesson ${i + 1}: Arabic Basics`,
      duration: "30 min",
    })),
  },
  {
    id: 103,
    title: "Seerah of the Prophet",
    speaker: "Yasir Qadhi",
    lessons: 30,
    duration: "25 hours",
    level: "Intermediate",
    description: "Explore the life and teachings of Prophet Muhammad (peace be upon him) in detail.",
    lessonList: Array.from({ length: 30 }, (_, i) => ({
      id: i + 1,
      title: `Episode ${i + 1}: The Prophet's Life`,
      duration: "50 min",
    })),
  },
  {
    id: 104,
    title: "Understanding Fiqh",
    speaker: "Mufti Menk",
    lessons: 15,
    duration: "8 hours",
    level: "Intermediate",
    description: "Deepen your understanding of Islamic jurisprudence and legal principles.",
    lessonList: Array.from({ length: 15 }, (_, i) => ({
      id: i + 1,
      title: `Fiqh Lesson ${i + 1}`,
      duration: "32 min",
    })),
  },
  {
    id: 105,
    title: "Tafsir of Surah Al-Kahf",
    speaker: "Nouman Ali Khan",
    lessons: 18,
    duration: "12 hours",
    level: "Advanced",
    description: "In-depth study of Surah Al-Kahf with linguistic and thematic analysis.",
    lessonList: Array.from({ length: 18 }, (_, i) => ({
      id: i + 1,
      title: `Tafsir Session ${i + 1}`,
      duration: "40 min",
    })),
  },
  {
    id: 106,
    title: "Islamic History",
    speaker: "Dr. Yasir Qadhi",
    lessons: 25,
    duration: "20 hours",
    level: "Intermediate",
    description: "Comprehensive overview of Islamic history from the time of the Prophet to modern times.",
    lessonList: Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      title: `History Lesson ${i + 1}`,
      duration: "48 min",
    })),
  },
  {
    id: 107,
    title: "Principles of Hadith",
    speaker: "Sheikh Ahmad Al-Khalil",
    lessons: 16,
    duration: "9 hours",
    level: "Advanced",
    description: "Learn the science of Hadith, its classification, and authentication methods.",
    lessonList: Array.from({ length: 16 }, (_, i) => ({
      id: i + 1,
      title: `Hadith Science ${i + 1}`,
      duration: "34 min",
    })),
  },
  {
    id: 108,
    title: "Family in Islam",
    speaker: "Omar Suleiman",
    lessons: 10,
    duration: "5 hours",
    level: "Beginner",
    description: "Understanding the Islamic perspective on family, marriage, and relationships.",
    lessonList: Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      title: `Family Values ${i + 1}`,
      duration: "30 min",
    })),
  },
];

export function getCourse(id: number): Course | undefined {
  return courses.find((course) => course.id === id);
}

export function getAllCourses(): Course[] {
  return courses;
}
