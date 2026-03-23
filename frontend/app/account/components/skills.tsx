"use client";
import { useAppData } from "@/app/context/AppContext";
import { AccountProps } from "@/components/type";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Award, Plus, Sparkle } from "lucide-react";
import React, { useState } from "react";

const Skills: React.FC<AccountProps> = ({ user, isYourAccount }) => {
  const { addSkill, btnLoading } = useAppData();
  const [skill, setSkill] = useState("");
  const addSkillHandler = () => {
    if (!skill.trim()) {
      alert("Please enter a skill");
      return;
    }
    addSkill(skill);
    setSkill("");
  };
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addSkillHandler();
    }
  };
  const removeSKillHandler = (skillToRemove: string) => {
    if (confirm(`Are you sure you want to remove ${skillToRemove} ?`)) {
    }
  };
  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <Card className="shadow-lg border-2 overflow-hidden">
        <div className="bg-blue-500 p-6 border-b">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <Award className="text-blue-600" size={20} />
            </div>
            <CardTitle className="text-2xl text-white ">
              {isYourAccount ? "Your Skills" : "User Skills"}
            </CardTitle>
            {isYourAccount && (
              <CardDescription className="text-sm mt-1 text-white">
                Showcase your expertise and abilities
              </CardDescription>
            )}
          </div>
        </div>
        {/* Add skilla input */}
        {isYourAccount && (
          <div className="flex gap-3 flex-col sm:flex-row">
            <div className="relative flex-1">
              <Sparkle
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50"
              />
              <Input
                type="text"
                placeholder="e.g. React,Node.js,Python..."
                className="h-11 pl-10 bg-background"
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>
            <Button
              onClick={addSkillHandler}
              className="h-11 gap-2 px-6"
              disabled={!skill.trim() || btnLoading}
            >
              <Plus size={18} />
              Add Skills
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Skills;
