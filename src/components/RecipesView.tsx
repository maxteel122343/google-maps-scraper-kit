import React from 'react';
import {
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Stethoscope,
  Hammer,
  UtensilsCrossed,
  Wrench,
  Sparkles,
  Info
} from 'lucide-react';
import { PLAYBOOK_RECIPES } from '../data/recipes';
import { Recipe, ScrapeJobConfig } from '../types/scraper';
import { CITY_PRESETS } from '../services/geocoding';

interface RecipesViewProps {
  onLoadRecipe: (config: ScrapeJobConfig) => void;
}

export const RecipesView: React.FC<RecipesViewProps> = ({ onLoadRecipe }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Stethoscope':
        return <Stethoscope className="w-5 h-5 text-sky-400" />;
      case 'Hammer':
        return <Hammer className="w-5 h-5 text-amber-400" />;
      case 'UtensilsCrossed':
        return <UtensilsCrossed className="w-5 h-5 text-rose-400" />;
      case 'Wrench':
        return <Wrench className="w-5 h-5 text-emerald-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-emerald-400" />;
    }
  };

  const handleApplyRecipe = (recipe: Recipe) => {
    const preset = CITY_PRESETS[recipe.suggestedCity] || { lat: '39.7392', lon: '-104.9903' };
    const config: ScrapeJobConfig = {
      name: recipe.title,
      keywords: recipe.keywords,
      city: recipe.suggestedCity,
      lat: preset.lat,
      lon: preset.lon,
      depth: recipe.depth,
      email: true,
      deepEmails: true,
      socials: true,
      maxTime: 300,
      radius: 10000,
      zoom: 15,
      fastMode: false
    };

    onLoadRecipe(config);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="w-5 h-5 text-emerald-400" />
          <h2 className="text-xl font-bold text-white">Playbooks & Outreach Recipes</h2>
        </div>
        <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
          Curated lead generation templates from the Google Maps Scraper Kit recipes documentation.
          Each recipe contains pre-tested multi-keyword batches, location anchors, and tactical outreach advice.
        </p>
      </div>

      {/* Recipe Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PLAYBOOK_RECIPES.map((recipe) => (
          <div
            key={recipe.id}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 shadow-xl flex flex-col justify-between transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  {getIcon(recipe.icon)}
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {recipe.suggestedCity}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white mb-1">{recipe.title}</h3>
              <p className="text-xs text-slate-400 mb-4">{recipe.subtitle}</p>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">{recipe.description}</p>

              {/* Keywords sample */}
              <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3 mb-4">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Multi-Keyword Batch ({recipe.keywords.length} terms)
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {recipe.keywords.map((kw, i) => (
                    <span
                      key={i}
                      className="text-xs px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300 font-mono"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tactical Outreach Best Practices */}
              <div className="space-y-1.5 mb-6">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Outreach Strategy Tips
                </div>
                {recipe.bestPractices.map((tip, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action button */}
            <button
              onClick={() => handleApplyRecipe(recipe)}
              className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-950 text-xs font-bold tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <span>Load Recipe into Scraper</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
