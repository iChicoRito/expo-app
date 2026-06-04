# Objective

## Gemini API to Groq API AI Integration Migration

---

## Description

This objective covers the migration of the existing AI question generation integration from the Gemini API to the Groq API. The switch involves replacing the current API key, endpoint, and model configuration with Groq-specific values. The target model to be used is `qwen/qwen3-32b`. All existing AI generation behavior, rules, and constraints established in prior objectives must be preserved — only the underlying API provider and model change.

---

## Objectives Breakdown

### 1. Primary Objective

Replace the Gemini API integration with the Groq API, using the provided API key and the `qwen/qwen3-32b` model, while retaining all existing AI question generation logic and rules.

---

### 2. Secondary Objectives

_Not applicable based on provided input._

---

### 3. Supporting Tasks

#### 3.1 API Configuration Replacement

- Remove the existing Gemini API key and endpoint configuration.
- Replace with the Groq API key: `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`.
- Update the API endpoint to the appropriate Groq API URL.
- Set the model to `qwen/qwen3-32b` in the request configuration.

#### 3.2 Request and Response Adaptation

- Update the request payload structure to match the Groq API's expected format.
- Update the response parsing logic to correctly extract the generated question from the Groq API response structure.
- Ensure all existing prompt instructions (12-word limit, category-specific generation) are carried over into the Groq request payload.

#### 3.3 Validation

- Confirm the AI question generation works end-to-end with the new Groq API and model.
- Ensure all previously established rules remain functional: 12-word question limit, deck category relevance, and the 15-generations-per-hour rate limit.

---

### 4. Detailed Breakdown

#### 4.1 API Key and Endpoint Update

The Gemini API key and base URL must be fully replaced. The Groq API key to configure is `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`. The Groq API base endpoint and required headers (such as `Authorization: Bearer`) must be applied according to Groq's API specification.

#### 4.2 Model Configuration

The model identifier must be set to `qwen/qwen3-32b` in the API request body. Any prior reference to a Gemini model name must be removed and replaced accordingly.

#### 4.3 Payload and Response Structure Alignment

The request body format for Groq follows a chat completion structure. The existing prompt logic — enforcing a maximum of 12 words per question and restricting generation to the selected deck's category — must be preserved and correctly mapped into Groq's expected message format. The response parsing must be updated to extract the generated text from Groq's response structure, which differs from Gemini's.
