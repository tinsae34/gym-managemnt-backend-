import { Beef, Dumbbell, Apple, Fish, Egg, Coffee } from 'lucide-react';

const GuideScreen = () => {
    return (
        <div className="min-h-screen bg-slate-900 pb-20">
            {/* Header */}
            <div className="bg-gradient-to-b from-blue-900/30 to-transparent px-6 pt-8 pb-6">
                <h1 className="text-2xl font-bold text-white mb-1">Fitness Guide</h1>
                <p className="text-slate-400 text-sm">Nutrition & Workout Tips</p>
            </div>

            <div className="px-6 space-y-6">
                {/* High-Protein Ethiopian Foods */}
                <section>
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Beef className="w-6 h-6 text-orange-400" />
                        High-Protein Local Foods
                    </h2>

                    <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                        <NutritionCard
                            icon={<Egg className="w-5 h-5" />}
                            name="Eggs (Inkuulaal)"
                            protein="6g per egg"
                            serving="3-4 eggs daily"
                            color="text-yellow-400"
                        />
                        <Divider />
                        <NutritionCard
                            icon={<Fish className="w-5 h-5" />}
                            name="Tilapia Fish"
                            protein="26g per 100g"
                            serving="150-200g per meal"
                            color="text-blue-400"
                        />
                        <Divider />
                        <NutritionCard
                            icon={<Coffee className="w-5 h-5" />}
                            name="Cottage Cheese (Ayib)"
                            protein="11g per 100g"
                            serving="100-150g daily"
                            color="text-slate-200"
                        />
                        <Divider />
                        <NutritionCard
                            icon={<Apple className="w-5 h-5" />}
                            name="Lentils (Misir)"
                            protein="9g per 100g"
                            serving="150-200g cooked"
                            color="text-red-400"
                        />
                        <Divider />
                        <NutritionCard
                            icon={<Beef className="w-5 h-5" />}
                            name="Peanut Butter (Okote)"
                            protein="25g per 100g"
                            serving="2-3 tablespoons"
                            color="text-orange-400"
                        />
                    </div>

                    <div className="mt-4 bg-blue-900/20 border border-blue-800/30 rounded-xl p-4">
                        <p className="text-sm text-blue-300">
                            <strong>💡 Pro Tip:</strong> Aim for 1.6-2.2g of protein per kg of body weight daily for muscle building.
                        </p>
                    </div>
                </section>

                {/* Workout Split */}
                <section>
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Dumbbell className="w-6 h-6 text-green-400" />
                        5-Day Workout Split
                    </h2>

                    <div className="space-y-3">
                        <WorkoutCard
                            day="Day 1"
                            focus="Upper Body"
                            exercises={['Bench Press', 'Rows', 'Shoulder Press', 'Bicep Curls']}
                            color="bg-blue-500/10 border-blue-500/30"
                        />
                        <WorkoutCard
                            day="Day 2"
                            focus="Lower Body"
                            exercises={['Squats', 'Deadlifts', 'Leg Press', 'Calf Raises']}
                            color="bg-green-500/10 border-green-500/30"
                        />
                        <WorkoutCard
                            day="Day 3"
                            focus="Rest / Cardio"
                            exercises={['Light walking', 'Stretching', 'Active recovery']}
                            color="bg-slate-700/30 border-slate-600/30"
                        />
                        <WorkoutCard
                            day="Day 4"
                            focus="Push (Chest, Shoulders, Triceps)"
                            exercises={['Incline Press', 'Lateral Raises', 'Tricep Dips', 'Push-ups']}
                            color="bg-orange-500/10 border-orange-500/30"
                        />
                        <WorkoutCard
                            day="Day 5"
                            focus="Pull & Legs"
                            exercises={['Pull-ups', 'Deadlifts', 'Lunges', 'Hamstring Curls']}
                            color="bg-purple-500/10 border-purple-500/30"
                        />
                    </div>

                    <div className="mt-4 bg-green-900/20 border border-green-800/30 rounded-xl p-4">
                        <p className="text-sm text-green-300">
                            <strong>🎯 Remember:</strong> Progressive overload is key. Increase weight or reps each week.
                        </p>
                    </div>
                </section>

                {/* Hydration */}
                <section className="bg-slate-800 rounded-xl p-5 border border-slate-700">
                    <h3 className="font-bold text-white mb-2">💧 Hydration Goal</h3>
                    <p className="text-slate-300 text-sm mb-3">
                        Drink at least 3-4 liters of water daily, especially during workouts.
                    </p>
                    <div className="flex gap-2">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="flex-1 h-8 bg-blue-500/20 rounded border border-blue-500/30"></div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

const NutritionCard = ({ icon, name, protein, serving, color }: any) => (
    <div className="p-4 flex items-center gap-4">
        <div className={`${color}`}>{icon}</div>
        <div className="flex-1">
            <h3 className="font-semibold text-white">{name}</h3>
            <p className="text-sm text-slate-400">{serving}</p>
        </div>
        <div className="text-right">
            <p className="font-bold text-green-400">{protein}</p>
        </div>
    </div>
);

const WorkoutCard = ({ day, focus, exercises, color }: any) => (
    <div className={`rounded-xl p-4 border ${color}`}>
        <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-white">{day}</h3>
            <span className="text-sm font-medium text-slate-300">{focus}</span>
        </div>
        <ul className="space-y-1">
            {exercises.map((exercise: string, i: number) => (
                <li key={i} className="text-sm text-slate-400 flex items-center gap-2">
                    <span className="w-1 h-1 bg-slate-500 rounded-full"></span>
                    {exercise}
                </li>
            ))}
        </ul>
    </div>
);

const Divider = () => <div className="border-t border-slate-700" />;

export default GuideScreen;
