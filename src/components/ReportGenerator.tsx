// src/components/ReportGenerator.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Download, 
  Loader, 
  CheckCircle, 
  AlertCircle,
  Info,
  Brain,
  BarChart3,
  User,
  Calendar,
  Heart,
  Activity,
  Moon,
  Apple,
  Pill
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { useAuth } from '../contexts/AuthContext';
import { useLongevityData } from '../hooks/useLongevityData';
import { useSleep } from '../hooks/useSleep';
import { useWorkout } from '../hooks/useWorkout';
import { useNutrition } from '../hooks/useNutrition';
import { useSupplement } from '../hooks/useSupplement';

interface ReportContentProps {
  longevityScore: number;
  biologicalAge: number;
  healthspan: number;
  vitalityIndex: number;
  sleepStats: any;
  workoutStats: any;
  weeklyNutritionScore: number;
  weeklyTotals: any;
  supplementStats: any;
  currentUser: any;
}

// Helper function to generate HTML content for the report
const generateReportHtmlContent = (reportProps: ReportContentProps, reportType: 'basic' | 'advanced'): string[] => {
  const {
    longevityScore, biologicalAge, healthspan, vitalityIndex,
    sleepStats, workoutStats, weeklyNutritionScore, weeklyTotals, supplementStats,
    currentUser
  } = reportProps;

  const commonHeader = `
    <div style="text-align: center; margin-bottom: 40px;">
      <h1 style="font-size: 28px; font-weight: bold; color: #4A00B0; margin-bottom: 10px;">
        LongevAI360 Health Report
      </h1>
      <p style="font-size: 14px; color: #666;">
        Generated: ${new Date().toLocaleDateString()}
      </p>
      <p style="font-size: 14px; color: #666;">
        For: ${currentUser?.displayName || 'User'} (${currentUser?.email || 'N/A'})
      </p>
    </div>
  `;

  const longevitySection = `
    <div style="margin-bottom: 30px; border: 2px solid #E0BBE4; border-radius: 8px; padding: 20px; background-color: #FDFDFD;">
      <h2 style="font-size: 20px; font-weight: bold; margin-bottom: 15px; color: #6B21A8;">
        Overall Longevity Metrics
      </h2>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
        <div><strong>Longevity Score:</strong> ${longevityScore}/10</div>
        <div><strong>Biological Age:</strong> ${biologicalAge} years</div>
        <div><strong>Healthspan:</strong> ${healthspan} years</div>
        <div><strong>Vitality Index:</strong> ${vitalityIndex}%</div>
      </div>
    </div>
  `;

  const sleepSection = `
    <div style="margin-bottom: 30px; border: 2px solid #E0BBE4; border-radius: 8px; padding: 20px; background-color: #FDFDFD;">
      <h2 style="font-size: 20px; font-weight: bold; margin-bottom: 15px; color: #6B21A8;">
        Sleep Overview
      </h2>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
        <div><strong>Avg Duration:</strong> ${sleepStats?.averageSleepDuration || 0}h</div>
        <div><strong>Avg Score:</strong> ${sleepStats?.averageSleepScore || 0}/100</div>
        <div><strong>Efficiency:</strong> ${sleepStats?.averageEfficiency || 0}%</div>
        <div><strong>Consistency:</strong> ${sleepStats?.consistency || 0}%</div>
      </div>
    </div>
  `;

  const workoutSection = `
    <div style="margin-bottom: 30px; border: 2px solid #E0BBE4; border-radius: 8px; padding: 20px; background-color: #FDFDFD;">
      <h2 style="font-size: 20px; font-weight: bold; margin-bottom: 15px; color: #6B21A8;">
        Workout Overview
      </h2>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
        <div><strong>Total Workouts:</strong> ${workoutStats?.totalWorkouts || 0}</div>
        <div><strong>Avg Duration:</strong> ${workoutStats?.averageDuration || 0} min</div>
        <div><strong>Consistency:</strong> ${workoutStats?.consistency || 0}%</div>
        <div><strong>Current Streak:</strong> ${workoutStats?.currentStreak || 0} days</div>
      </div>
    </div>
  `;

  const nutritionSection = `
    <div style="margin-bottom: 30px; border: 2px solid #E0BBE4; border-radius: 8px; padding: 20px; background-color: #FDFDFD;">
      <h2 style="font-size: 20px; font-weight: bold; margin-bottom: 15px; color: #6B21A8;">
        Nutrition Overview
      </h2>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
        <div><strong>Weekly Score:</strong> ${weeklyNutritionScore || 0}/100</div>
        <div><strong>Weekly Calories:</strong> ${Math.round(weeklyTotals?.calories || 0)} kcal</div>
        <div><strong>Weekly Protein:</strong> ${Math.round(weeklyTotals?.protein || 0)}g</div>
        <div><strong>Weekly Fiber:</strong> ${Math.round(weeklyTotals?.fiber || 0)}g</div>
      </div>
    </div>
  `;

  const supplementSection = `
    <div style="margin-bottom: 30px; border: 2px solid #E0BBE4; border-radius: 8px; padding: 20px; background-color: #FDFDFD;">
      <h2 style="font-size: 20px; font-weight: bold; margin-bottom: 15px; color: #6B21A8;">
        Supplement Overview
      </h2>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
        <div><strong>Active Supplements:</strong> ${supplementStats?.activeSupplements || 0}</div>
        <div><strong>Adherence Rate:</strong> ${supplementStats?.adherenceRate || 0}%</div>
        <div><strong>Monthly Cost:</strong> $${supplementStats?.totalCost || 0}</div>
        <div><strong>Optimization Score:</strong> ${supplementStats?.supplementScore || 0}/100</div>
      </div>
    </div>
  `;

  const disclaimer = `
    <p style="font-size: 12px; color: #666; margin-top: 40px; text-align: center;">
      Disclaimer: This report is for informational purposes only and should not replace professional medical advice.
    </p>
  `;

  const pages: string[] = [];

  if (reportType === 'basic') {
    pages.push(`
      <div style="background-color: white; color: black; padding: 40px; font-family: Arial, sans-serif; line-height: 1.6; min-height: 297mm;">
        ${commonHeader}
        ${longevitySection}
        ${sleepSection}
        ${disclaimer}
      </div>
    `);
  } else { // advanced report
    // Page 1: Header + Longevity + Sleep
    pages.push(`
      <div style="background-color: white; color: black; padding: 40px; font-family: Arial, sans-serif; line-height: 1.6; min-height: 297mm;">
          ${commonHeader}
          ${longevitySection}
          ${sleepSection}
          ${disclaimer}
      </div>
    `);

    // Page 2: Workout + Nutrition + Supplements
    pages.push(`
      <div style="background-color: white; color: black; padding: 40px; font-family: Arial, sans-serif; line-height: 1.6; min-height: 297mm;">
          <h1 style="font-size: 28px; font-weight: bold; color: #4A00B0; margin-bottom: 10px; text-align: center;">
              LongevAI360 Advanced Health Report (Page 2)
          </h1>
          ${workoutSection}
          ${nutritionSection}
          ${supplementSection}
          ${disclaimer}
      </div>
    `);

    // Page 3: Overall Health Summary (Key Indicators, Longevity Score, Health Review)
    pages.push(`
      <div style="background-color: white; color: black; padding: 40px; font-family: Arial, sans-serif; line-height: 1.6; min-height: 297mm;">
          <h1 style="font-size: 28px; font-weight: bold; color: #4A00B0; margin-bottom: 10px; text-align: center;">
              LongevAI360 Advanced Health Report (Page 3)
          </h1>
          <div style="margin-bottom: 30px; background-color: #fff; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); padding: 20px;">
              <h2 style="color: #333; font-size: 22px; font-weight: bold; margin-bottom: 20px; text-align: center;">Overall Health Summary</h2>
              <div style="display: flex; flex-wrap: wrap; justify-content: space-around; gap: 20px;">
                  <!-- Key Health Indicators -->
                  <div style="flex: 1 1 45%; min-width: 300px; padding: 15px; border: 1px solid #eee; border-radius: 8px;">
                      <h3 style="color: #333; font-size: 18px; margin-bottom: 15px;">Key Health Indicators</h3>
                      <table style="width: 100%; border-collapse: collapse;">
                          <tr style="background-color: #f0f8ff;">
                              <th style="padding: 8px; text-align: left; border-bottom: 1px solid #eee;">Category</th>
                              <th style="padding: 8px; text-align: right; border-bottom: 1px solid #eee;">Score</th>
                          </tr>
                          <tr><td style="padding: 8px; border-bottom: 1px solid #eee;">Sleep Quality</td><td style="padding: 8px; text-align: right; border-bottom: 1px solid #eee;">${sleepStats?.averageSleepScore || 'N/A'}</td></tr>
                          <tr><td style="padding: 8px; border-bottom: 1px solid #eee;">Workout Consistency</td><td style="padding: 8px; text-align: right; border-bottom: 1px solid #eee;">${workoutStats?.consistency || 'N/A'}%</td></tr>
                          <tr><td style="padding: 8px; border-bottom: 1px solid #eee;">Nutrition Score</td><td style="padding: 8px; text-align: right; border-bottom: 1px solid #eee;">${weeklyNutritionScore || 'N/A'}%</td></tr>
                          <tr><td style="padding: 8px; border-bottom: 1px solid #eee;">Supplement Optimization</td><td style="padding: 8px; text-align: right; border-bottom: 1px solid #eee;">${supplementStats?.supplementScore || 'N/A'}%</td></tr>
                          <tr><td style="padding: 8px; text-align: right; border-bottom: 1px solid #eee;">Vitality Index</td><td style="padding: 8px; text-align: right; border-bottom: 1px solid #eee;">${vitalityIndex || 'N/A'}%</td></tr>
                      </table>
                  </div>
                  <!-- Overall Longevity Score -->
                  <div style="flex: 1 1 45%; min-width: 300px; padding: 15px; border: 1px solid #eee; border-radius: 8px; text-align: center;">
                      <h3 style="color: #333; font-size: 18px; margin-bottom: 15px;">Overall Longevity Score</h3>
                      <!-- Simple CSS Gauge -->
                      <div style="width: 120px; height: 120px; border-radius: 50%; background: conic-gradient(#10B981 ${longevityScore * 10}%, #eee ${longevityScore * 10}%); margin: 0 auto 15px auto; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold; color: #10B981;">
                          ${longevityScore}/10
                      </div>
                      <p style="color: #666; font-size: 14px;">Your current Longevity Score, reflecting your overall health optimization.</p>
                  </div>
                  <!-- Health Review Summary -->
                  <div style="flex: 1 1 95%; padding: 15px; border: 1px solid #eee; border-radius: 8px;">
                      <h3 style="color: #333; font-size: 18px; margin-bottom: 15px;">Health Review Summary</h3>
                      <ul style="list-style: none; padding: 0; margin: 0; font-size: 14px; color: #555;">
                          <li style="margin-bottom: 10px;">&bull; Your biological age is ${biologicalAge} years, indicating good health relative to your chronological age.</li>
                          <li style="margin-bottom: 10px;">&bull; Projected healthspan of ${healthspan} years, suggesting a long period of healthy living.</li>
                          <li style="margin-bottom: 10px;">&bull; Continue focusing on consistent sleep and balanced nutrition for sustained vitality.</li>
                      </ul>
                  </div>
              </div>
          </div>
          ${disclaimer}
    `);

    // Page 4: Key Health Metrics
    pages.push(`
      <div style="background-color: white; color: black; padding: 40px; font-family: Arial, sans-serif; line-height: 1.6; min-height: 297mm;">
          <h1 style="font-size: 28px; font-weight: bold; color: #4A00B0; margin-bottom: 10px; text-align: center;">
              LongevAI360 Advanced Health Report (Page 4)
          </h1>
          <div style="margin-bottom: 30px; background-color: #fff; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); padding: 20px;">
              <h2 style="color: #333; font-size: 22px; font-weight: bold; margin-bottom: 20px; text-align: center;">Key Health Metrics</h2>
              <div style="display: flex; flex-wrap: wrap; gap: 20px;">
                  <!-- Metric Card Template -->
                  <div style="flex: 1 1 calc(33% - 20px); min-width: 250px; border: 1px solid #eee; border-radius: 8px; padding: 15px; text-align: center;">
                      <h3 style="font-size: 16px; color: #4A00B0; margin-bottom: 10px;">Average Sleep Duration</h3>
                      <div style="font-size: 24px; font-weight: bold; color: #333;">${sleepStats?.averageSleepDuration || 'N/A'}h</div>
                      <p style="font-size: 12px; color: #666;">Target: 7-9h</p>
                      <div style="width: 100%; height: 8px; background-color: #eee; border-radius: 4px; margin-top: 10px;">
                          <div style="width: ${Math.min((sleepStats?.averageSleepDuration / 8) * 100, 100)}%; height: 100%; background-color: #6366F1; border-radius: 4px;"></div>
                      </div>
                  </div>
                  <div style="flex: 1 1 calc(33% - 20px); min-width: 250px; border: 1px solid #eee; border-radius: 8px; padding: 15px; text-align: center;">
                      <h3 style="font-size: 16px; color: #4A00B0; margin-bottom: 10px;">Workout Frequency</h3>
                      <div style="font-size: 24px; font-weight: bold; color: #333;">${workoutStats?.thisWeekWorkouts || 'N/A'}x/week</div>
                      <p style="font-size: 12px; color: #666;">Target: 3-5x/week</p>
                      <div style="width: 100%; height: 8px; background-color: #eee; border-radius: 4px; margin-top: 10px;">
                          <div style="width: ${Math.min((workoutStats?.thisWeekWorkouts / 4) * 100, 100)}%; height: 100%; background-color: #F97316; border-radius: 4px;"></div>
                      </div>
                  </div>
                  <div style="flex: 1 1 calc(33% - 20px); min-width: 250px; border: 1px solid #eee; border-radius: 8px; padding: 15px; text-align: center;">
                      <h3 style="font-size: 16px; color: #4A00B0; margin-bottom: 10px;">Avg. Daily Protein</h3>
                      <div style="font-size: 24px; font-weight: bold; color: #333;">${Math.round((weeklyTotals?.protein || 0) / 7) || 'N/A'}g</div>
                      <p style="font-size: 12px; color: #666;">Target: 100-150g</p>
                      <div style="width: 100%; height: 8px; background-color: #eee; border-radius: 4px; margin-top: 10px;">
                          <div style="width: ${Math.min(((weeklyTotals?.protein || 0) / 7) / 120 * 100, 100)}%; height: 100%; background-color: #10B981; border-radius: 4px;"></div>
                      </div>
                  </div>
                  <div style="flex: 1 1 calc(33% - 20px); min-width: 250px; border: 1px solid #eee; border-radius: 8px; padding: 15px; text-align: center;">
                      <h3 style="font-size: 16px; color: #4A00B0; margin-bottom: 10px;">Supplement Adherence</h3>
                      <div style="font-size: 24px; font-weight: bold; color: #333;">${supplementStats?.adherenceRate || 'N/A'}%</div>
                      <p style="font-size: 12px; color: #666;">Target: 90%</p>
                      <div style="width: 100%; height: 8px; background-color: #eee; border-radius: 4px; margin-top: 10px;">
                          <div style="width: ${Math.min(supplementStats?.adherenceRate || 0, 100)}%; height: 100%; background-color: #8B5CF6; border-radius: 4px;"></div>
                      </div>
                  </div>
              </div>
          </div>
          ${disclaimer}
    `);

    // Page 5: Risk Levels Overview
    pages.push(`
      <div style="background-color: white; color: black; padding: 40px; font-family: Arial, sans-serif; line-height: 1.6; min-height: 297mm;">
          <h1 style="font-size: 28px; font-weight: bold; color: #4A00B0; margin-bottom: 10px; text-align: center;">
              LongevAI360 Advanced Health Report (Page 5)
          </h1>
          <div style="margin-bottom: 30px; background-color: #fff; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); padding: 20px;">
              <h2 style="color: #333; font-size: 22px; font-weight: bold; margin-bottom: 20px; text-align: center;">Risk Levels Overview</h2>
              <div style="display: flex; flex-wrap: wrap; gap: 15px;">
                  <div style="flex: 1 1 calc(50% - 15px); min-width: 200px; border: 1px solid #eee; border-radius: 8px; padding: 15px;">
                      <h3 style="font-size: 16px; color: #4A00B0; margin-bottom: 10px;">Biological Age</h3>
                      <div style="font-size: 24px; font-weight: bold; color: #EF4444;">${biologicalAge} years</div>
                      <p style="font-size: 12px; color: #666;">Compared to chronological age, indicating cellular health.</p>
                  </div>
                  <div style="flex: 1 1 calc(50% - 15px); min-width: 200px; border: 1px solid #eee; border-radius: 8px; padding: 15px;">
                      <h3 style="font-size: 16px; color: #4A00B0; margin-bottom: 10px;">Healthspan Potential</h3>
                      <div style="font-size: 24px; font-weight: bold; color: #3B82F6;">${healthspan} years</div>
                      <p style="font-size: 12px; color: #666;">Projected years of healthy, active life.</p>
                  </div>
              </div>
              <div style="margin-top: 20px;">
                  <h3 style="font-size: 16px; color: #4A00B0; margin-bottom: 10px;">Key Risk Factors</h3>
                  <ul style="list-style: none; padding: 0; margin: 0; font-size: 14px; color: #555;">
                      <li style="margin-bottom: 5px;">&bull; Cardiovascular Health: <span style="color: ${longevityScore > 7 ? '#10B981' : '#EF4444'}; font-weight: bold;">${longevityScore > 7 ? 'Low Risk' : 'Moderate Risk'}</span></li>
                      <li style="margin-bottom: 5px;">&bull; Metabolic Health: <span style="color: ${weeklyNutritionScore > 70 ? '#10B981' : '#EF4444'}; font-weight: bold;">${weeklyNutritionScore > 70 ? 'Low Risk' : 'Moderate Risk'}</span></li>
                      <li style="margin-bottom: 5px;">&bull; Musculoskeletal Health: <span style="color: ${workoutStats?.consistency > 70 ? '#10B981' : '#EF4444'}; font-weight: bold;">${workoutStats?.consistency > 70 ? 'Low Risk' : 'Moderate Risk'}</span></li>
                  </ul>
              </div>
          </div>
          ${disclaimer}
    `);

    // Page 6: Recent Trends
    pages.push(`
      <div style="background-color: white; color: black; padding: 40px; font-family: Arial, sans-serif; line-height: 1.6; min-height: 297mm;">
          <h1 style="font-size: 28px; font-weight: bold; color: #4A00B0; margin-bottom: 10px; text-align: center;">
              LongevAI360 Advanced Health Report (Page 6)
          </h1>
          <div style="margin-bottom: 30px; background-color: #fff; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); padding: 20px;">
              <h2 style="color: #333; font-size: 22px; font-weight: bold; margin-bottom: 20px; text-align: center;">Recent Trends</h2>
              <div style="display: flex; flex-wrap: wrap; gap: 20px;">
                  <div style="flex: 1 1 calc(50% - 20px); min-width: 250px; border: 1px solid #eee; border-radius: 8px; padding: 15px; text-align: center;">
                      <h3 style="font-size: 16px; color: #4A00B0; margin-bottom: 10px;">Sleep Score Trend (Last 7 Days)</h3>
                      <p style="font-size: 24px; font-weight: bold; color: ${sleepStats?.averageSleepScore > 75 ? '#10B981' : '#EF4444'};">${sleepStats?.averageSleepScore || 'N/A'}/100</p>
                      <p style="font-size: 12px; color: #666;">${sleepStats?.currentStreak > 0 ? `Current streak: ${sleepStats.currentStreak} days` : 'No recent streak'}</p>
                  </div>
                  <div style="flex: 1 1 calc(50% - 20px); min-width: 250px; border: 1px solid #eee; border-radius: 8px; padding: 15px; text-align: center;">
                      <h3 style="font-size: 16px; color: #4A00B0; margin-bottom: 10px;">Workout Consistency Trend</h3>
                      <p style="font-size: 24px; font-weight: bold; color: ${workoutStats?.consistency > 70 ? '#10B981' : '#EF4444'};">${workoutStats?.consistency || 'N/A'}%</p>
                      <p style="font-size: 12px; color: #666;">${workoutStats?.thisMonthWorkouts || 'N/A'} workouts this month</p>
                  </div>
              </div>
          </div>
          ${disclaimer}
    `);
  }

  return pages; // Return the array of page HTML strings
};


const ReportGenerator: React.FC = () => {
  const { currentUser } = useAuth();
  const { longevityScore, biologicalAge, healthspan, vitalityIndex, loading: longevityLoading } = useLongevityData();
  const { sleepStats, loading: sleepLoading } = useSleep();
  const { workoutStats, loading: workoutLoading } = useWorkout();
  const { weeklyNutritionScore, weeklyTotals, loading: nutritionLoading } = useNutrition();
  const { supplementStats, loading: supplementLoading } = useSupplement();

  const [selectedReport, setSelectedReport] = useState<'basic' | 'advanced'>('advanced');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [lastGenerated, setLastGenerated] = useState<string | null>(null);
  const [isPremiumQuality, setIsPremiumQuality] = useState(false); // State for premium quality

  const generatePDFReport = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      setGenerationProgress(25);

      // Prepare report props
      const reportProps: ReportContentProps = {
        longevityScore,
        biologicalAge,
        healthspan,
        vitalityIndex,
        sleepStats,
        workoutStats,
        weeklyNutritionScore,
        weeklyTotals,
        supplementStats,
        currentUser
      };

      // Generate array of HTML content for each page
      const pagesHtml = generateReportHtmlContent(reportProps, selectedReport);

      const pdf = new jsPDF('p', 'mm', 'a4');

      const scale = isPremiumQuality ? 2 : 1; // Determine scale based on premium quality checkbox

      for (let i = 0; i < pagesHtml.length; i++) {
          const pageHtml = pagesHtml[i];
          
          // Create a temporary div for the current page's content
          const pageTempContainer = document.createElement('div');
          pageTempContainer.style.position = 'absolute';
          pageTempContainer.style.left = '-9999px';
          pageTempContainer.style.top = '0';
          pageTempContainer.style.width = '210mm'; // A4 width
          pageTempContainer.style.padding = '20mm'; // Add some padding
          pageTempContainer.style.backgroundColor = 'white';
          pageTempContainer.style.color = 'black';
          pageTempContainer.innerHTML = pageHtml;
          document.body.appendChild(pageTempContainer);

          // Render this page's content to a canvas
          const canvas = await html2canvas(pageTempContainer, {
              scale: scale, // Use the dynamic scale here
              useCORS: true,
              allowTaint: true,
              backgroundColor: '#ffffff'
          });

          // Add the canvas image to the PDF
          const imgData = canvas.toDataURL('image/png');
          const imgWidth = 210; // A4 width in mm
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          if (i > 0) {
              pdf.addPage(); // Add a new page for subsequent sections
          }
          pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

          // Clean up the temporary div for this page
          document.body.removeChild(pageTempContainer);

          setGenerationProgress(50 + Math.round((i + 1) / pagesHtml.length * 50)); // Update progress
      }

      setGenerationProgress(100);

      // Download PDF
      pdf.save(`LongevAI360_Health_Report_${selectedReport}.pdf`);
      setLastGenerated(new Date().toLocaleTimeString());

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF report. Please try again.');
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Health Reports</h3>
          <p className="text-gray-300">Generate comprehensive health reports</p>
        </div>
        
        <motion.button 
          className="p-2 bg-white/10 rounded-lg border border-white/20 hover:bg-white/20 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FileText className="w-5 h-5 text-white" />
        </motion.button>
      </div>

    

      {/* Quality Selection Radio Buttons */}
      <div className="mb-6">
        <label className="text-white font-semibold mb-3 block">Report Quality</label>
        <div className="grid grid-cols-2 gap-4">
          <motion.button
            onClick={() => setIsPremiumQuality(false)}
            className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-xl border transition-all ${
              !isPremiumQuality
                ? 'border-purple-500/50 bg-purple-500/20'
                : 'border-white/20 bg-white/5 hover:bg-white/10'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              !isPremiumQuality ? 'border-purple-500' : 'border-gray-400'
            }`}>
              {!isPremiumQuality && (
                <motion.div
                  className="w-3 h-3 bg-purple-500 rounded-full"
                  layoutId="radio-dot"
                />
              )}
            </div>
            <span className="text-white font-medium">Standard Quality</span>
          </motion.button>

          <motion.button
            onClick={() => setIsPremiumQuality(true)}
            className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-xl border transition-all ${
              isPremiumQuality
                ? 'border-purple-500/50 bg-purple-500/20'
                : 'border-white/20 bg-white/5 hover:bg-white/10'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              isPremiumQuality ? 'border-purple-500' : 'border-gray-400'
            }`}>
              {isPremiumQuality && (
                <motion.div
                  className="w-3 h-3 bg-purple-500 rounded-full"
                  layoutId="radio-dot"
                />
              )}
            </div>
            <span className="text-white font-medium">Premium Quality</span>
          </motion.button>
        </div>
      </div>

      {/* Generate Button */}
      <motion.button
        onClick={generatePDFReport}
        disabled={isGenerating}
        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        whileHover={{ scale: isGenerating ? 1 : 1.02 }}
        whileTap={{ scale: isGenerating ? 1 : 0.98 }}
      >
        {isGenerating ? (
          <>
            <Loader className="w-5 h-5 animate-spin" />
            <span>Generating Report... {generationProgress}%</span>
          </>
        ) : (
          <>
            <Download className="w-5 h-5" />
            <span>Generate Advanced Report</span> {/* Always Advanced */}
          </>
        )}
      </motion.button>

      {/* Generation Progress */}
      {isGenerating && (
        <div className="mt-4">
          <div className="w-full bg-white/10 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${generationProgress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      )}

      {/* Last Generated */}
      {lastGenerated && !isGenerating && (
        <div className="mt-4 p-3 bg-emerald-500/20 border border-emerald-500/30 rounded-xl flex items-center space-x-3">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <span className="text-emerald-300 text-sm">
            Report generated successfully at {lastGenerated}
          </span>
        </div>
      )}

      {/* Report Info */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-4 border border-purple-500/30">
          <div className="flex items-center space-x-3 mb-2">
            <Info className="w-5 h-5 text-purple-400" />
            <h4 className="text-white font-semibold">Report Information</h4>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed">
            reports include analytics, risk assessments, correlation analysis, and detailed action plans suitable for healthcare provider consultations.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReportGenerator;
