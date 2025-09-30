// curriculum.ts

export interface Topic {
  id: string;
  title: string;
  summary?: string;
  contentUrl?: string;
  order?: number;
}

export interface Subject {
  id: string;
  name: string;
  stream?: string | null;
  topics: Topic[];
}

export interface Stream {
  id: string;
  name: string;
  subjects: Subject[];
}

export interface ClassData {
  id: string;
  name: string;
  streams: Stream[];
}

// Common subjects for primary classes (1-5)
const primarySubjects: Omit<Subject, 'topics'>[] = [
  { id: 'math', name: 'Mathematics', stream: null },
  { id: 'eng', name: 'English', stream: null },
  { id: 'evs', name: 'Environmental Science', stream: null },
  { id: 'hindi', name: 'Hindi', stream: null },
  { id: 'comp', name: 'Computer Basics', stream: null },
];

// Common subjects for middle school (6-8)
const middleSchoolSubjects: Omit<Subject, 'topics'>[] = [
  ...primarySubjects,
  { id: 'sci', name: 'Science', stream: null },
  { id: 'sst', name: 'Social Studies', stream: null },
  { id: 'sans', name: 'Sanskrit', stream: null },
];

// Stream-specific subjects for high school (9-12)
const scienceStream: Omit<Subject, 'topics'>[] = [
  { id: 'phy', name: 'Physics', stream: 'science' },
  { id: 'chem', name: 'Chemistry', stream: 'science' },
  { id: 'bio', name: 'Biology', stream: 'science' },
  { id: 'math', name: 'Mathematics', stream: 'science' },
  { id: 'comp', name: 'Computer Science', stream: 'science' },
];

const commerceStream: Omit<Subject, 'topics'>[] = [
  { id: 'acc', name: 'Accountancy', stream: 'commerce' },
  { id: 'bus', name: 'Business Studies', stream: 'commerce' },
  { id: 'eco', name: 'Economics', stream: 'commerce' },
  { id: 'math', name: 'Mathematics', stream: 'commerce' },
  { id: 'ip', name: 'Informatics Practices', stream: 'commerce' },
];

const artsStream: Omit<Subject, 'topics'>[] = [
  { id: 'hist', name: 'History', stream: 'arts' },
  { id: 'pol', name: 'Political Science', stream: 'arts' },
  { id: 'geo', name: 'Geography', stream: 'arts' },
  { id: 'eco', name: 'Economics', stream: 'arts' },
  { id: 'psy', name: 'Psychology', stream: 'arts' },
  { id: 'soc', name: 'Sociology', stream: 'arts' },
];

// Generate topics for a subject based on class level
const generateTopics = (subjectId: string, classLevel: number): Topic[] => {
  const topics: Topic[] = [];
  const baseTopics: Record<string, string[]> = {
    math: ['Numbers', 'Basic Operations', 'Shapes', 'Measurements', 'Data Handling'],
    eng: ['Reading', 'Writing', 'Grammar', 'Comprehension', 'Creative Writing'],
    evs: ['Family', 'Plants', 'Animals', 'Our Environment', 'Safety'],
    sci: ['Matter', 'Energy', 'Living Organisms', 'Earth', 'Universe'],
    sst: ['History', 'Geography', 'Civics', 'Economics'],
    phy: ['Mechanics', 'Thermodynamics', 'Electromagnetism', 'Optics', 'Modern Physics'],
    chem: ['Basic Concepts', 'Atomic Structure', 'Chemical Bonding', 'Organic Chemistry', 'Physical Chemistry'],
    bio: ['Cell Biology', 'Genetics', 'Ecology', 'Human Physiology', 'Biotechnology'],
    acc: ['Introduction to Accounting', 'Financial Statements', 'Partnership', 'Company Accounts', 'Analysis of Financial Statements'],
    bus: ['Nature and Purpose of Business', 'Forms of Business', 'Business Services', 'Marketing', 'Finance'],
    eco: ['Microeconomics', 'Macroeconomics', 'Indian Economic Development', 'Statistics for Economics'],
    hist: ['Ancient History', 'Medieval History', 'Modern History', 'World History'],
    pol: ['Political Theory', 'Indian Constitution', 'International Relations', 'Contemporary World Politics'],
    geo: ['Fundamentals', 'Physical Geography', 'Human Geography', 'Practical Work'],
  };

  const subjectBase = subjectId.split('-')[0];
  const subjectTopics = baseTopics[subjectBase] || ['Introduction', 'Core Concepts', 'Advanced Topics'];

  subjectTopics.forEach((topic, index) => {
    topics.push({
      id: `${subjectId}-t${index + 1}`,
      title: `${topic} ${classLevel > 0 ? `- Class ${classLevel}` : ''}`.trim(),
      order: index + 1,
    });
  });

  return topics;
};

// Generate class data for a range of classes
const generateClassData = (start: number, end: number, subjects: Omit<Subject, 'topics'>[]): ClassData[] => {
  const classes: ClassData[] = [];
  
  for (let i = start; i <= end; i++) {
    const classSubjects = subjects.map(subject => ({
      ...subject,
      topics: generateTopics(`${subject.id}-${i}`, i)
    }));

    classes.push({
      id: `class-${i}`,
      name: `Class ${i}`,
      streams: [
        {
          id: 'general',
          name: 'General',
          subjects: classSubjects.filter(sub => !sub.stream)
        }
      ]
    });
  }
  
  return classes;
};

// Generate high school class data with streams
const generateHighSchoolData = (start: number, end: number): ClassData[] => {
  const classes: ClassData[] = [];
  
  for (let i = start; i <= end; i++) {
    const scienceSubjects = scienceStream.map(subject => ({
      ...subject,
      topics: generateTopics(`${subject.id}-${i}`, i)
    }));

    const commerceSubjects = commerceStream.map(subject => ({
      ...subject,
      topics: generateTopics(`${subject.id}-${i}`, i)
    }));

    const artsSubjects = artsStream.map(subject => ({
      ...subject,
      topics: generateTopics(`${subject.id}-${i}`, i)
    }));

    classes.push({
      id: `class-${i}`,
      name: `Class ${i}`,
      streams: [
        {
          id: 'science',
          name: 'Science',
          subjects: scienceSubjects
        },
        {
          id: 'commerce',
          name: 'Commerce',
          subjects: commerceSubjects
        },
        {
          id: 'arts',
          name: 'Arts',
          subjects: artsSubjects
        }
      ]
    });
  }
  
  return classes;
};

// Generate complete curriculum for classes 1-12
export const seed: ClassData[] = [
  ...generateClassData(1, 5, primarySubjects),
  ...generateClassData(6, 8, middleSchoolSubjects),
  ...generateHighSchoolData(9, 10), // 9-10 with common subjects but stream awareness
  ...generateHighSchoolData(11, 12) // 11-12 with full streams
];

// Utility function to find class by ID
export function findClassById(classId: string): ClassData | undefined {
  return seed.find(cls => cls.id === classId);
}

// Utility function to find stream by ID
export function findStreamById(classId: string, streamId: string): Stream | undefined {
  const cls = findClassById(classId);
  return cls?.streams.find(stream => stream.id === streamId);
}

// Utility function to find subject by ID
export function findSubjectById(classId: string, streamId: string, subjectId: string): Subject | undefined {
  const stream = findStreamById(classId, streamId);
  return stream?.subjects.find(subject => subject.id === subjectId);
}

// Export types for use in other modules
export type { Topic, Subject, Stream, ClassData };
