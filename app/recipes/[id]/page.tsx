import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, Users } from "lucide-react";
import Image from 'next/image';
import { RecipeActions } from "./components/recipe-actions";
import { RecipeService } from "@/lib/services/recipe.service";
import { Recipe } from "@/types/recipe";

interface Props {
  params: {
    id: string;
  };
}

interface Ingredient {
  name: string;
  amount: string;
  unit: string;
}

async function getRecipe(id: string) {
  try {
    const recipeData = await RecipeService.getRecipe(id);
    return {
      ...recipeData as unknown as Recipe,
      ingredients: JSON.parse(recipeData.ingredients),
      instructions: JSON.parse(recipeData.instructions)
    };
  } catch (error) {
    console.error('Error fetching recipe:', error);
    return null;
  }
}

export default async function RecipePage({ 
  params: { id } 
}: { 
  params: { id: string } 
}) {
  const recipe = await getRecipe(await id);

  if (!recipe) {
    return <div className="container py-8 text-center">Recipe not found</div>;
  }

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <div className="relative aspect-video mb-8 rounded-lg overflow-hidden">
          <Image
            src={recipe.image}
            alt={recipe.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
        </div>

        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">{recipe.title}</h1>
            <p className="text-muted-foreground mb-4">{recipe.description}</p>
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                {recipe.time}
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                {recipe.servings} servings
              </div>
            </div>
          </div>
          <RecipeActions 
            recipeId={recipe.$id ?? ''} 
            userId={recipe.userId ?? ''} 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Ingredients</h2>
            <ul className="space-y-2">
              {recipe.ingredients.map((ingredient: Ingredient, index: number) => (
                <li key={index} className="flex justify-between">
                  <span>{ingredient.name}</span>
                  <span className="text-muted-foreground">
                    {ingredient.amount} {ingredient.unit}
                  </span>
                </li>
              ))}
            </ul>
          </Card>

          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Instructions</h2>
            <ol className="space-y-4">
              {recipe.instructions.map((instruction: string, index: number) => (
                <li key={index} className="flex">
                  <span className="font-bold mr-4">{index + 1}.</span>
                  <span>{instruction}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}