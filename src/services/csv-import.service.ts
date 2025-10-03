import { Repository } from "typeorm";
import { Curriculum, Course, CurriculumTitle, LessonType } from "../entities/course/course.entity";
import { User } from "../entities/user/user.entity";
import csv from "csv-parser";
import { Readable } from "stream";

export interface CsvRow {
  curriculumTitle: string;
  curriculumDescription: string;
  courseTitle: string;
  courseDescription: string;
  endDate: string;
  videoUrl?: string;
  lessonType: string;
  instructorEmail?: string;
}

export class CsvImportService {
  private readonly curriculumRepository: Repository<Curriculum>;
  private readonly courseRepository: Repository<Course>;
  private readonly userRepository: Repository<User>;

  constructor(
    curriculumRepository: Repository<Curriculum>,
    courseRepository: Repository<Course>,
    userRepository: Repository<User>
  ) {
    this.curriculumRepository = curriculumRepository;
    this.courseRepository = courseRepository;
    this.userRepository = userRepository;
  }

  async importFromCsv(csvBuffer: Buffer): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      const rows = await this.parseCsv(csvBuffer);
      const results = await this.processRows(rows);

      return {
        success: true,
        message: `Successfully imported ${results.created} curriculums and ${results.courses} courses. ${results.errors.length} errors.`,
        data: {
          created: results.created,
          courses: results.courses,
          errors: results.errors
        }
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error occurred"
      };
    }
  }

  private async parseCsv(csvBuffer: Buffer): Promise<CsvRow[]> {
    return new Promise((resolve, reject) => {
      const results: CsvRow[] = [];
      const stream = Readable.from(csvBuffer.toString());

      stream
        .pipe(csv())
        .on('data', (data: CsvRow) => results.push(data))
        .on('end', () => resolve(results))
        .on('error', reject);
    });
  }

  private async processRows(rows: CsvRow[]): Promise<{ created: number; courses: number; errors: string[] }> {
    const errors: string[] = [];
    const curriculumMap = new Map<string, Curriculum>();
    let coursesCreated = 0;

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNumber = i + 2; // +2 because CSV starts at row 1 and we skip header

      try {
        // Validate enum values
        if (!Object.values(CurriculumTitle).includes(row.curriculumTitle as CurriculumTitle)) {
          errors.push(`Row ${rowNumber}: Invalid curriculum title "${row.curriculumTitle}"`);
          continue;
        }

        if (!Object.values(LessonType).includes(row.lessonType as LessonType)) {
          errors.push(`Row ${rowNumber}: Invalid lesson type "${row.lessonType}"`);
          continue;
        }

        // Get or create curriculum
        let curriculum = curriculumMap.get(row.curriculumTitle);
        if (!curriculum) {
          const foundCurriculum = await this.curriculumRepository.findOne({
            where: { title: row.curriculumTitle as CurriculumTitle }
          });

          if (foundCurriculum) {
            curriculum = foundCurriculum;
          } else {
            curriculum = this.curriculumRepository.create({
              title: row.curriculumTitle as CurriculumTitle,
              description: row.curriculumDescription
            });
            curriculum = await this.curriculumRepository.save(curriculum);
          }
          curriculumMap.set(row.curriculumTitle, curriculum);
        }

        // Find instructor if email provided
        let instructor: User | undefined = undefined;
        if (row.instructorEmail) {
          const foundInstructor = await this.userRepository.findOne({
            where: { email: row.instructorEmail }
          });
          if (foundInstructor) {
            instructor = foundInstructor;
          } else {
            errors.push(`Row ${rowNumber}: Instructor with email "${row.instructorEmail}" not found`);
          }
        }

        // Create course
        const course = this.courseRepository.create({
          title: row.courseTitle,
          description: row.courseDescription,
          endDate: new Date(row.endDate),
          videoUrl: row.videoUrl,
          lessonType: row.lessonType as LessonType,
          curriculum,
          instructor
        });

        await this.courseRepository.save(course);
        coursesCreated++;

      } catch (error) {
        errors.push(`Row ${rowNumber}: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
    }

    return {
      created: curriculumMap.size,
      courses: coursesCreated,
      errors
    };
  }

  generateSampleCsv(): string {
    const headers = [
      'curriculumTitle',
      'curriculumDescription',
      'courseTitle',
      'courseDescription',
      'endDate',
      'videoUrl',
      'lessonType',
      'instructorEmail'
    ].join(',');

    const sampleRows = [
      [
        'Frontend Development - Beginner',
        'Learn the basics of frontend development',
        'HTML Fundamentals',
        'Learn HTML basics and structure',
        '2024-12-31',
        'https://example.com/video1',
        'Live Class',
        'instructor@example.com'
      ].join(','),
      [
        'Frontend Development - Beginner',
        'Learn the basics of frontend development',
        'CSS Styling',
        'Master CSS styling techniques',
        '2024-12-31',
        '',
        'Virtual Class',
        ''
      ].join(',')
    ];

    return [headers, ...sampleRows].join('\n');
  }
}