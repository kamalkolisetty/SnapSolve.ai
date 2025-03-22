import google.generativeai as genai
import ast
import json
from PIL import Image
from constants import GEMINI_API_KEY

genai.configure(api_key=GEMINI_API_KEY)

def analyze_image(img: Image, dict_of_vars: dict):
    """
    Analyzes an image containing mathematical expressions, equations, 
    or graphical problems using the Gemini 1.5 Flash model.

    Args:
        img: The input image.
        dict_of_vars: A dictionary of user-defined variables.

    Returns:
        A list of dictionaries, where each dictionary represents 
        an expression or equation and its result. 
    """
    model = genai.GenerativeModel(model_name="gemini-2.0-flash")
    dict_of_vars_str = json.dumps(dict_of_vars, ensure_ascii=False)
    prompt = (
        f"You have been given an image with some mathematical expressions, "
        f"equations, or graphical problems, and you need to solve them. "
        f"Note: Use the PEMDAS rule for solving mathematical expressions. "
        f"PEMDAS stands for the Priority Order: Parentheses, Exponents, "
        f"Multiplication and Division (from left to right), Addition and "
        f"Subtraction (from left to right). Parentheses have the highest priority, "
        f"followed by Exponents, then Multiplication and Division, and lastly "
        f"Addition and Subtraction. "
        f"For example: "
        f"Q. 2 + 3 * 4 "
        f"(3 * 4) => 12, 2 + 12 = 14. "
        f"Q. 2 + 3 + 5 * 4 - 8 / 2 "
        f"5 * 4 => 20, 8 / 2 => 4, 2 + 3 => 5, 5 + 20 => 25, 25 - 4 => 21. "
        f"YOU CAN HAVE FIVE TYPES OF EQUATIONS/EXPRESSIONS IN THIS IMAGE, "
        f"AND ONLY ONE CASE SHALL APPLY EVERY TIME: "
        f"Following are the cases: "
        f"1. Simple mathematical expressions like 2 + 2, 3 * 4, 5 / 6, 7 - 8, etc.: "
        f"In this case, solve and return the answer in the format of a "
        f"LIST OF ONE DICT [{{'expr': given expression, 'result': calculated answer}}]. "
        f"2. Set of Equations like x^2 + 2x + 1 = 0, 3y + 4x = 0, 5x^2 + 6y + 7 = 12, etc.: "
        f"In this case, solve for the given variable, and the format should be a "
        f"COMMA SEPARATED LIST OF DICTS, with dict 1 as {{'expr': 'x', 'result': 2, "
        f"'assign': True}} and dict 2 as {{'expr': 'y', 'result': 5, 'assign': True}}. "
        f"This example assumes x was calculated as 2, and y as 5. Include as many "
        f"dicts as there are variables. "
        f"3. Assigning values to variables like x = 4, y = 5, z = 6, etc.: "
        f"In this case, assign values to variables and return another key in the "
        f"dict called {{'assign': True}}, keeping the variable as 'expr' and the "
        f"value as 'result' in the original dictionary. RETURN AS A LIST OF DICTS. "
        f"4. Analyzing Graphical Math problems, which are word problems "
        f"represented in drawing form, such as cars colliding, trigonometric "
        f"problems, problems on the Pythagorean theorem, adding runs from a "
        f"cricket wagon wheel, etc. These will have a drawing representing "
        f"some scenario and accompanying information with the image. "
        f"PAY CLOSE ATTENTION TO DIFFERENT COLORS FOR THESE PROBLEMS. "
        f"You need to return the answer in the format of a LIST OF ONE DICT "
        f"[{{'expr': given expression, 'result': calculated answer}}]. "
        f"5. Detecting Abstract Concepts that a drawing might show, such as love, "
        f"hate, jealousy, patriotism, or a historic reference to war, invention, "
        f"discovery, quote, etc. USE THE SAME FORMAT AS OTHERS TO RETURN THE "
        f"ANSWER, where 'expr' will be the explanation of the drawing, and "
        f"'result' will be the abstract concept. "
        f"Analyze the equation or expression in this image and return the "
        f"answer according to the given rules: "
        f"Make sure to use extra backslashes for escape characters like \\f -> \\\\f, "
        f"\\n -> \\\\n, etc. "
        f"Here is a dictionary of user-assigned variables. If the given expression "
        f"has any of these variables, use its actual value from this dictionary "
        f"accordingly: {dict_of_vars_str}. "
        f"DO NOT USE BACKTICKS OR MARKDOWN FORMATTING. "
        f"PROPERLY QUOTE THE KEYS AND VALUES IN THE DICTIONARY FOR EASIER "
    )
    response = model.generate_content([prompt, img])
    t=response.text 
    si=t.find('[')
    li=t.find(']')

     
    print(t[si:li+1])
    answers=[]

     

    
    try:
    # Attempt to parse as a list of dictionaries
        answers = ast.literal_eval(response.text) 
         
    except Exception as e:
        print(f"Error parsing response: {e}")
        
   
  
     
    print('returned answer ', answers)
    for answer in answers:
        if 'assign' in answer:
            answer['assign'] = True
        else:
            answer['assign'] = False
    return answers
 