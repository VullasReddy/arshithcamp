export const isCertificateUnlocked = (courseId, userId, course) => {
  if (!courseId) return { modulesDone: false, testPassed: false, projectSubmitted: false, canGenerateCertificate: false };

  // 1. Modules completion
  const completedCount = course?.modules?.filter(m => m.completed).length || 0;
  const totalCount = course?.modules?.length || 1;
  const modulesDone = (course?.progress === 100 || completedCount === totalCount);

  // 2. Final Assessment passed
  const testPassed = 
    localStorage.getItem(`arb_final_passed_${courseId}_${userId}`) === 'true' ||
    localStorage.getItem(`final_test_passed_${courseId}`) === 'true';

  // 3. Project GitHub Repo link submitted
  let projectSubmitted = 
    localStorage.getItem(`arb_proj_submitted_${courseId}_${userId}`) === 'true' ||
    localStorage.getItem(`project_submitted_${courseId}`) === 'true';

  if (!projectSubmitted && course?.projects) {
    projectSubmitted = course.projects.some(p => {
      const saved = localStorage.getItem(`arb_proj_sub_${courseId}_${p.id}`);
      return !!saved;
    });
  }

  return {
    modulesDone,
    testPassed,
    projectSubmitted,
    canGenerateCertificate: modulesDone && testPassed && projectSubmitted
  };
};
