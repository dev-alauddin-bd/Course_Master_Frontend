import { CheckCircle2, Lock as LucideLock, PlayCircle, ChevronLeft, ChevronRight, Loader2, Book, FileText, HelpCircle } from "lucide-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useCompleteLessonMutation } from "@/redux/features/course/courseAPi";
import { useGetEnrolledCourseContentQuery } from "@/redux/features/enroll/enrollApi";
import { IModule, ILesson } from "@/interfaces/course.interface";
import { ProgressBar } from "./progress-bar";

interface CoursePlayerProps {
  courseId: string;
}

type TabType = "lesson" | "quiz" | "assignment";

export default function CoursePlayer({ courseId }: CoursePlayerProps) {
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [activeItemType, setActiveItemType] = useState<"lesson" | "quiz" | "assignment">("lesson");

  const { data, isLoading, refetch } = useGetEnrolledCourseContentQuery(courseId);
  const courseData = data?.data;
  const modulesData = courseData?.modules || [];

  const module: any = modulesData[currentModuleIndex];
  const lesson: ILesson | undefined = module?.lessons?.[currentLessonIndex];

  const [completeLesson, { isLoading: isCompleting }] = useCompleteLessonMutation();

  // Reset tab to lesson when jumping between lessons
  useEffect(() => {
    setActiveItemType("lesson");
  }, [currentLessonIndex, currentModuleIndex]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
        <p className="text-gray-500 font-medium animate-pulse">Loading your course content...</p>
      </div>
    );
  }

  // ✅ Mark Lesson Complete
  const handleCompleteLesson = async () => {
    if (!lesson) return;
    try {
      await completeLesson({
        courseId,
        lessonId: lesson.id,
      }).unwrap();

      toast.success("Great job! Lesson completed.");
      refetch(); // Refresh to update locks
    } catch (err: any) {
      console.error(err);
      toast.error(err.data?.message || "Failed to complete lesson");
    }
  };

  // ✅ Next Lesson
  const handleNextLesson = () => {
    if (!module?.lessons || module.lessons.length === 0) return;
    
    if (currentLessonIndex < module.lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
    } else if (currentModuleIndex < modulesData.length - 1) {
      setCurrentModuleIndex(currentModuleIndex + 1);
      setCurrentLessonIndex(0);
    }
  };

  // ✅ Previous Lesson
  const handlePrevLesson = () => {
    if (!module?.lessons || module.lessons.length === 0) return;
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
    } else if (currentModuleIndex > 0) {
      const prevModule = modulesData[currentModuleIndex - 1];
      setCurrentModuleIndex(currentModuleIndex - 1);
      setCurrentLessonIndex((prevModule.lessons?.length || 1) - 1);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Side: Video & Content */}
        <div className="lg:col-span-3 space-y-6">
          {lesson ? (
            <>
              {/* Header Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                    <span>{courseData?.title}</span>
                    <span>•</span>
                    <span>Module {currentModuleIndex + 1}</span>
                    <span>•</span>
                    <span>Lesson {currentLessonIndex + 1}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                    <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white">
                      {lesson.title}
                    </h2>
                    {lesson.isCompleted && (
                        <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full text-xs font-black">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            COMPLETED
                        </span>
                    )}
                </div>
              </div>

              {/* Removed Lesson-level Quiz/Assignment Tabs because they are now Module-level */}

              {/* Main Display Area */}
              <div className="w-full aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-gray-200 dark:border-zinc-800 relative group transition-all">
                {!lesson.isUnlocked ? (
                  <div className="absolute inset-0 z-20 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center text-center p-8">
                    <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-6">
                        <LucideLock className="w-10 h-10 text-white animate-pulse" />
                    </div>
                    <h3 className="text-2xl font-black text-white mb-2">Lesson Locked</h3>
                    <p className="text-gray-400 max-w-sm mb-8">
                      Complete all previous lessons in this course to unlock this content.
                    </p>
                  </div>
                ) : activeItemType === "lesson" ? (
                  (() => {
                     let finalUrl = lesson.videoUrl;
                     const ytMatch = finalUrl?.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/);
                     if (ytMatch && ytMatch[2].length === 11) {
                         finalUrl = `https://www.youtube.com/embed/${ytMatch[2]}`;
                     }

                     if (finalUrl?.includes("youtube.com/embed") || finalUrl?.includes("youtube-nocookie.com/embed") || finalUrl?.includes("vimeo.com")) {
                         return (
                            <iframe 
                               src={finalUrl} 
                               title={lesson.title}
                               allowFullScreen 
                               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                               className="w-full h-full border-0"
                            />
                         );
                     }

                     return (
                        <video 
                           controls 
                           className="w-full h-full object-contain bg-black"
                           src={finalUrl}
                        >
                           Your browser does not support the video tag.
                    </video>
                     );
                  })()
                ) : activeItemType === "quiz" ? (
                  <div className="absolute inset-0 bg-white dark:bg-zinc-900 p-8 overflow-y-auto">
                    <div className="max-w-2xl mx-auto space-y-8">
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black uppercase text-gray-900 dark:text-white">Module Quiz</h3>
                            <p className="text-gray-500">Test your knowledge with {module.quiz?.questions?.length || 0} questions.</p>
                        </div>
                        <div className="space-y-6">
                            {module.quiz?.questions?.map((q: any, idx: number) => (
                                <div key={q.id} className="p-6 bg-gray-50 dark:bg-zinc-800 rounded-2xl border border-gray-100 dark:border-zinc-700">
                                    <p className="font-bold text-lg mb-4 text-gray-900 dark:text-white">{idx + 1}. {q.question}</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {q.options.map((opt:any, optIdx:number) => (
                                            <button key={optIdx} className="p-4 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl text-left hover:border-blue-500 hover:text-blue-600 transition-all font-medium text-sm">
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-white dark:bg-zinc-900 p-8 overflow-y-auto">
                    <div className="max-w-2xl mx-auto space-y-8">
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black uppercase text-gray-900 dark:text-white">Module Assignment</h3>
                            <p className="text-gray-500">Submit your work via {module.assignment?.submissionType}.</p>
                        </div>
                        <div className="p-8 bg-blue-50 dark:bg-blue-900/10 border-2 border-dashed border-blue-200 dark:border-blue-800 rounded-3xl text-center space-y-4">
                            <Book className="w-12 h-12 text-blue-600 mx-auto" />
                            <p className="text-gray-700 dark:text-gray-300 font-medium leading-relaxed">
                                {module.assignment?.description}
                            </p>
                            <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20">
                                Submit Assignment
                            </button>
                        </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Progress & Completion Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase mb-1">Module Progress</p>
                        <h4 className="font-bold text-gray-900 dark:text-white truncate">{module.title}</h4>
                    </div>
                    <div className="mt-4 space-y-2">
                        <div className="flex justify-between text-xs font-bold">
                            <span className="text-blue-600">{module.progressPercentage}% Completed</span>
                            <span className="text-gray-500">{module.completedCount}/{module.lessonCount} Lessons</span>
                        </div>
                        <ProgressBar progress={module.progressPercentage} />
                    </div>
                </div>

                <div className="p-6 bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm flex items-center justify-between gap-6">
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase mb-1">Lesson Duration</p>
                        <p className="text-xl font-black text-gray-900 dark:text-white leading-none">{lesson.duration}m</p>
                    </div>
                    <button
                      onClick={handleCompleteLesson}
                      disabled={isCompleting || lesson.isCompleted || !lesson.isUnlocked}
                      className={`flex-1 px-6 py-4 rounded-2xl font-black transition-all shadow-lg flex items-center justify-center gap-2 ${
                        lesson.isCompleted 
                        ? "bg-emerald-50 text-emerald-600 shadow-none border border-emerald-100 cursor-default"
                        : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20 disabled:opacity-50"
                      }`}
                    >
                      {isCompleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                      {lesson.isCompleted ? "Lesson Completed" : "Mark as Complete"}
                    </button>
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-4">
                <button
                  onClick={handlePrevLesson}
                  disabled={currentModuleIndex === 0 && currentLessonIndex === 0}
                  className="flex items-center gap-2 px-8 py-3 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-900 dark:text-gray-300 rounded-xl font-bold transition-all disabled:opacity-30"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Previous
                </button>
                <div className="hidden md:flex items-center gap-4 text-sm font-bold text-gray-400">
                    <span>Lesson {currentLessonIndex + 1} of {module.lessonCount}</span>
                </div>
                <button
                  onClick={handleNextLesson}
                  disabled={
                    currentModuleIndex === modulesData.length - 1 &&
                    currentLessonIndex === (module?.lessons?.length || 0) - 1
                  }
                  className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 disabled:opacity-30"
                >
                  Next Lesson
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[50vh] bg-gray-50 dark:bg-zinc-900/50 rounded-[40px] border-2 border-dashed border-gray-200 dark:border-zinc-800 p-8 text-center">
              <PlayCircle className="w-20 h-20 text-gray-200 mb-6" />
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">No lesson selected</h3>
              <p className="text-gray-500 max-w-sm">Please select an unlocked lesson from the curriculum to start your learning journey.</p>
            </div>
          )}
        </div>

        {/* Right Sidebar: Curriculum */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-xl overflow-hidden sticky top-24">
            <div className="p-6 border-b border-gray-50 dark:border-zinc-800 flex items-center justify-between">
                <h3 className="font-black text-gray-900 dark:text-white flex items-center gap-2 uppercase tracking-tighter">
                    Course Content
                </h3>
                <span className="text-[10px] bg-blue-600 text-white px-2.5 py-1 rounded-full font-black">
                    {modulesData.length} MODS
                </span>
            </div>
            <div className="max-h-[calc(100vh-180px)] overflow-y-auto p-4 space-y-6">
              {modulesData.map((mod: any, modIdx: number) => (
                <div key={mod.id} className="space-y-3">
                  <div className="flex items-center justify-between px-2">
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Module {modIdx + 1}
                      </h4>
                      <span className="text-[10px] font-bold text-blue-600">{mod.progressPercentage}%</span>
                  </div>
                  <h5 className="px-2 font-bold text-gray-900 dark:text-white text-sm leading-tight mb-2">{mod.title}</h5>
                  <div className="space-y-1.5">
                    {mod.lessons?.map((les: ILesson, lesIdx: number) => {
                      const isActive = currentModuleIndex === modIdx && currentLessonIndex === lesIdx;
                      const isLocked = !les.isUnlocked;
                      const isCompleted = les.isCompleted;

                      return (
                        <button
                          key={les.id}
                          disabled={isLocked && !isActive}
                          className={`w-full group/item flex items-center justify-between p-4 rounded-2xl transition-all text-left relative overflow-hidden ${
                            isActive
                              ? "bg-blue-600 text-white shadow-xl shadow-blue-600/30"
                              : isLocked 
                                ? "bg-gray-50/50 dark:bg-zinc-800/30 text-gray-400 cursor-not-allowed"
                                : "hover:bg-blue-50 dark:hover:bg-zinc-800 text-gray-800 dark:text-gray-200"
                          }`}
                          onClick={() => {
                            if (!isLocked || isActive) {
                              setCurrentModuleIndex(modIdx);
                              setCurrentLessonIndex(lesIdx);
                            }
                          }}
                        >
                          <div className="flex items-center gap-4 overflow-hidden z-10 w-full">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                                isActive 
                                ? "bg-white/20 rotate-12" 
                                : isLocked 
                                  ? "bg-gray-100 dark:bg-zinc-800" 
                                  : "bg-white dark:bg-zinc-700 shadow-sm group-hover/item:scale-110"
                            }`}>
                                {isLocked ? (
                                    <LucideLock className="w-4 h-4 text-gray-400" />
                                ) : isCompleted ? (
                                    <CheckCircle2 className={`w-4 h-4 ${isActive ? "text-white" : "text-emerald-500"}`} />
                                ) : (
                                    <PlayCircle className={`w-4 h-4 ${isActive ? "text-white" : "text-blue-500"}`} />
                                )}
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="text-sm font-bold truncate leading-none mb-1">
                                    {lesIdx + 1}. {les.title}
                                </span>
                                <div className="flex items-center gap-2 opacity-60">
                                    <span className="text-[10px] font-black uppercase">{les.duration}M</span>
                                </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}

                    {/* Module Assessment Buttons */}
                    {mod.quiz && (
                        <button
                          className={`w-full group/item flex items-center justify-between p-4 rounded-2xl transition-all text-left relative overflow-hidden ${
                            currentModuleIndex === modIdx && activeItemType === "quiz"
                              ? "bg-amber-500 text-white shadow-xl shadow-amber-500/30"
                              : "hover:bg-amber-50 dark:hover:bg-zinc-800 text-gray-800 dark:text-gray-200"
                          }`}
                          onClick={() => {
                              setCurrentModuleIndex(modIdx);
                              setActiveItemType("quiz");
                          }}
                        >
                          <div className="flex items-center gap-4">
                             <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${currentModuleIndex === modIdx && activeItemType === "quiz" ? "bg-white/20" : "bg-white border text-amber-500"}`}>
                                <HelpCircle className="w-4 h-4" />
                             </div>
                             <span className="text-sm font-bold truncate">Module Quiz</span>
                          </div>
                        </button>
                    )}
                    
                    {mod.assignment && (
                        <button
                          className={`w-full group/item flex items-center justify-between p-4 rounded-2xl transition-all text-left relative overflow-hidden ${
                            currentModuleIndex === modIdx && activeItemType === "assignment"
                              ? "bg-purple-500 text-white shadow-xl shadow-purple-500/30"
                              : "hover:bg-purple-50 dark:hover:bg-zinc-800 text-gray-800 dark:text-gray-200"
                          }`}
                          onClick={() => {
                              setCurrentModuleIndex(modIdx);
                              setActiveItemType("assignment");
                          }}
                        >
                          <div className="flex items-center gap-4">
                             <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${currentModuleIndex === modIdx && activeItemType === "assignment" ? "bg-white/20" : "bg-white border text-purple-500"}`}>
                                <FileText className="w-4 h-4" />
                             </div>
                             <span className="text-sm font-bold truncate">Module Assignment</span>
                          </div>
                        </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


