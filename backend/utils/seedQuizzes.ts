import Quiz from "../models/Quiz.js";

export const createSampleQuizzes = async () => {
  try {
    const sampleQuizzes = [
      {
        quizId: 1,
        questions: []
      },
      {
        quizId: 2,
        questions: []
      },
      {
        quizId: 3,
        questions: []
      },
      {
        quizId: 4,
        questions: []
      }
    ];

    // Clear existing quizzes first (optional)
    await Quiz.deleteMany({});

    // Create all quizzes
    const createdQuizzes = await Quiz.insertMany(sampleQuizzes);
    
    console.log(`Successfully created ${createdQuizzes.length} quizzes`);
    
    return {
      success: true,
      message: `Created ${createdQuizzes.length} quizzes with IDs 1-4`,
      data: createdQuizzes
    };

  } catch (error) {
    console.error('Error creating sample quizzes:', error);
    return {
      success: false,
      message: 'Failed to create sample quizzes',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};