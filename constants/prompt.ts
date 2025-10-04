const initial_prompt = `Generate ONE Primary 5 mathematics word problem in Singapore style.  

Requirements:
- Context should be realistic (school, shopping, transport, daily life).  
- Use whole numbers or simple fractions/decimals suitable for Primary 5.  
- Provide ONLY valid JSON output in this format:  

{
  "problem_text": "The math word problem here.",
  "final_answer": <numeric answer only, no units>
}

Notes:
- Do not include explanations, steps, or extra text outside the JSON.  
- "problem_text" must be a single string.  
- "final_answer" must be strictly a number (integer or decimal).`;