import google.generativeai as genai
import ast
import json
import logging
import re
from PIL import Image
from constants import GEMINI_API_KEY
import os
from google.api_core.exceptions import GoogleAPIError, ResourceExhausted

# Configure logging to output to console with a clear format
logging.basicConfig(level=logging.DEBUG, format='%(levelname)s: %(message)s', handlers=[logging.StreamHandler()])
logger = logging.getLogger(__name__)

# Load API keys from environment
API_KEYS = [
    os.getenv('GEMINI_API_KEY', GEMINI_API_KEY),
    os.getenv('GEMINI_API_KEY2', ''),
    os.getenv('GEMINI_API_KEY3', '')
]
# Filter out empty keys
API_KEYS = [key for key in API_KEYS if key]

# Initialize with the first API key
genai.configure(api_key=API_KEYS[0])
current_api_key_index = 0

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
    logger.debug("Starting analyze_image function")
    print("=== Starting Image Analysis ===")
    
    # Validate input image
    if not isinstance(img, Image.Image):
        logger.error("Invalid image input: Not a PIL Image object")
        print("ERROR: Provided input is not a valid PIL Image")
        return []

    model = genai.GenerativeModel(model_name="gemini-1.5-flash")
    dict_of_vars_str = json.dumps(dict_of_vars, ensure_ascii=False)
    print(f"User-defined variables: {dict_of_vars_str}")
    logger.debug(f"User-defined variables: {dict_of_vars_str}")

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
        f"PROPERLY QUOTE THE KEYS AND VALUES IN THE DICTIONARY FOR EASIER PARSING. "
        f"RETURN ONLY THE LIST OF DICTIONARIES AS A VALID PYTHON LIST STRING."
    )
    
    global current_api_key_index
    max_attempts = len(API_KEYS)
    attempt = 0

    while attempt < max_attempts:
        try:
            logger.debug(f"Sending request to Gemini model with API key {current_api_key_index + 1}")
            print(f"Sending image to Gemini model with API key {current_api_key_index + 1}...")
            response = model.generate_content([prompt, img])
            logger.debug("Received response from Gemini model")
            print("Received response from Gemini model")
            
            response_text = response.text.strip()
            logger.debug(f"Raw response: {response_text}")
            print(f"Raw model response: {response_text}")

            # Clean the response text
            cleaned_response = response_text.replace('```json', '').replace('```', '').strip()
            logger.debug(f"Cleaned response: {cleaned_response}")
            print(f"Cleaned response: {cleaned_response}")

            # First try ast.literal_eval
            try:
                answers = ast.literal_eval(cleaned_response)
                logger.info("Successfully parsed with ast.literal_eval")
                print("Parsed response with ast.literal_eval")

                # Convert single dict to list if needed
                if isinstance(answers, dict):
                    answers = [answers]
                
                # Validate and process answers
                processed_answers = []
                for answer in answers:
                    if not isinstance(answer, dict):
                        logger.warning(f"Invalid answer format, skipping: {answer}")
                        print(f"WARNING: Invalid answer format - {answer}")
                        continue
                    
                    processed_answer = {
                        'expr': answer.get('expr', ''),
                        'result': answer.get('result', ''),
                        'assign': str(answer.get('assign', 'false')).lower() == 'true'
                    }
                    processed_answers.append(processed_answer)
                
                logger.debug(f"Processed answers (ast.literal_eval): {processed_answers}")
                print(f"Processed answers (ast.literal_eval): {processed_answers}")
                print("=== Image Analysis Complete ===")
                return processed_answers
            
            except (SyntaxError, ValueError) as e:
                logger.warning(f"ast.literal_eval failed, trying manual parsing: {e}")
                print(f"WARNING: ast.literal_eval failed - {e}, attempting manual parsing")
                
                # Manual parsing fallback
                pattern = r'\{.*?\}'
                matches = re.findall(pattern, cleaned_response, re.DOTALL)
                logger.debug(f"Regex matches: {matches}")
                print(f"Regex matches: {matches}")
                
                processed_answers = []
                for match in matches:
                    try:
                        # Extract expr
                        expr_match = re.search(r'"expr"\s*:\s*"([^"]*)"', match)
                        expr = expr_match.group(1) if expr_match else ''
                        
                        # Extract result
                        result_match = re.search(r'"result"\s*:\s*([^,}]+)', match)
                        result = result_match.group(1).strip() if result_match else ''
                        
                        # Extract assign (handle both "assign":true and "assign":"true")
                        assign_match = re.search(r'"assign"\s*:\s*(true|false|"true"|"false")', match, re.IGNORECASE)
                        assign = False
                        if assign_match:
                            assign_val = assign_match.group(1).lower().replace('"', '')
                            assign = assign_val == 'true'
                        
                        if expr and result:
                            processed_answers.append({
                                'expr': expr,
                                'result': result,
                                'assign': assign
                            })
                    except Exception as e:
                        logger.warning(f"Error parsing match {match}: {e}")
                        print(f"WARNING: Error parsing match {match} - {e}")
                        continue
                
                if processed_answers:
                    logger.debug(f"Processed answers (regex): {processed_answers}")
                    print(f"Processed answers (regex): {processed_answers}")
                    print("=== Image Analysis Complete ===")
                    return processed_answers
                
                # Last resort parsing
                logger.warning("Manual parsing failed, trying last resort parsing")
                print("WARNING: Manual parsing failed, attempting last resort parsing")
                
                start = cleaned_response.find('[')
                end = cleaned_response.rfind(']')
                logger.debug(f"Last resort - si: {start}, li: {end}")
                print(f"Last resort - si: {start}, li: {end}")
                
                if start != -1 and end != -1:
                    core_content = cleaned_response[start+1:end]
                    dict_strings = [s.strip() for s in core_content.split('},')]
                    dict_strings = [s + '}' if not s.endswith('}') else s for s in dict_strings]
                    logger.debug(f"Last resort dict strings: {dict_strings}")
                    print(f"Last resort dict strings: {dict_strings}")
                    
                    for ds in dict_strings:
                        try:
                            d = {}
                            pairs = [p.strip() for p in ds.strip('{}').split(',')]
                            for p in pairs:
                                if ':' in p:
                                    key, val = p.split(':', 1)
                                    key = key.strip().strip('"\'')
                                    val = val.strip().strip('"\'').lower()
                                    d[key] = val
                            
                            if 'expr' in d and 'result' in d:
                                processed_answers.append({
                                    'expr': d['expr'],
                                    'result': d['result'],
                                    'assign': d.get('assign', 'false') == 'true'
                                })
                        except Exception as e:
                            logger.warning(f"Error parsing dictionary string {ds}: {e}")
                            print(f"WARNING: Error parsing dictionary string {ds} - {e}")
                            continue
                    
                    if processed_answers:
                        logger.debug(f"Processed answers (last resort): {processed_answers}")
                        print(f"Processed answers (last resort): {processed_answers}")
                        print("=== Image Analysis Complete ===")
                        return processed_answers
                
                logger.error("All parsing attempts failed")
                print("ERROR: All parsing attempts failed")
                return []

        except ResourceExhausted as e:
            logger.error(f"Quota exceeded with API key {current_api_key_index + 1}: {e}")
            print(f"ERROR: Quota exceeded with API key {current_api_key_index + 1} - {e}")
            current_api_key_index = (current_api_key_index + 1) % len(API_KEYS)
            attempt += 1
            if attempt < max_attempts:
                logger.debug(f"Switching to API key {current_api_key_index + 1}")
                print(f"Switching to API key {current_api_key_index + 1}")
                genai.configure(api_key=API_KEYS[current_api_key_index])
                model = genai.GenerativeModel(model_name="gemini-1.5-flash")
                continue
            else:
                logger.error("All API keys exceeded quota")
                print("ERROR: All API keys exceeded quota. Please check your plan and billing details at https://ai.google.dev/gemini-api/docs/rate-limits")
                return []
        except GoogleAPIError as e:
            logger.error(f"Google API error processing image: {e}")
            print(f"ERROR: Google API error - {e}")
            return []
        except Exception as e:
            logger.error(f"Error processing image: {e}")
            print(f"ERROR: General error - {e}")
            return []