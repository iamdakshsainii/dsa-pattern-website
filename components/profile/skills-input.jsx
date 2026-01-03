'use client'

import { useState, useRef } from 'react'
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X, Plus } from 'lucide-react'

const SUGGESTED_SKILLS = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust',
  'React', 'Next.js', 'Vue.js', 'Angular', 'Node.js', 'Express', 'Django', 'Flask',
  'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Firebase',
  'Data Structures', 'Algorithms', 'System Design', 'OOP', 'Design Patterns',
  'Git', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP',
  'Machine Learning', 'Deep Learning', 'AI', 'NLP',
  'REST API', 'GraphQL', 'WebSockets', 'Microservices',
  'Testing', 'CI/CD', 'Agile', 'Scrum'
]

export default function SkillsInput({ value = [], onChange, maxSkills = 20 }) {
  const [inputValue, setInputValue] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef(null)

  const filteredSuggestions = SUGGESTED_SKILLS.filter(skill =>
    !value.includes(skill) &&
    skill.toLowerCase().includes(inputValue.toLowerCase())
  ).slice(0, 8)

  const addSkill = (skill) => {
    const trimmedSkill = skill.trim()
    if (trimmedSkill && !value.includes(trimmedSkill) && value.length < maxSkills) {
      onChange([...value, trimmedSkill])
      setInputValue('')
      setShowSuggestions(false)
      inputRef.current?.focus()
    }
  }

  const removeSkill = (skillToRemove) => {
    onChange(value.filter(skill => skill !== skillToRemove))
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (inputValue.trim()) {
        addSkill(inputValue)
      }
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      removeSkill(value[value.length - 1])
    }
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            type="text"
            placeholder={value.length >= maxSkills ? `Max ${maxSkills} skills` : "Add a skill..."}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value)
              setShowSuggestions(true)
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            disabled={value.length >= maxSkills}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => addSkill(inputValue)}
            disabled={!inputValue.trim() || value.length >= maxSkills}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {showSuggestions && inputValue && filteredSuggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border rounded-lg shadow-lg max-h-48 overflow-y-auto">
            {filteredSuggestions.map((skill) => (
              <button
                key={skill}
                type="button"
                onClick={() => addSkill(skill)}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
              >
                {skill}
              </button>
            ))}
          </div>
        )}
      </div>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((skill) => (
            <Badge key={skill} variant="secondary" className="pl-3 pr-1 py-1">
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="ml-2 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-500">
        {value.length}/{maxSkills} skills added. Press Enter or click + to add.
      </p>

      {value.length === 0 && (
        <div className="mt-3">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Quick add:</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_SKILLS.slice(0, 6).map((skill) => (
              <Button
                key={skill}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addSkill(skill)}
                className="text-xs"
              >
                {skill}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
