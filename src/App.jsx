import { useState } from "react";
import "./App.css";
import { OpenAI } from "openai";
import "dotenv";

function App() {
  const [input, setInput] = useState("");
  const [emailTemplate, setEmailTemplate] = useState("");
  const [loading, setLoading] = useState(false);
  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });
  const submitInput = async () => {
    if (input == "") {
      alert("Please enter some input");
      return;
    }
    setLoading(true);
    try {
      const result = await openai.completions.create({
        model: "gpt-3.5-turbo-instruct",
        prompt: `Write a promotion email for a ${input}`,
        max_tokens: 4000,
        temperature: 0,
      });
      // console.log("response", result.choices[0].text);
      const paragraphs = result.choices[0].text.split("\n");
      console.log(paragraphs);
      setEmailTemplate(paragraphs);
    } catch (e) {
      console.log(e);
      setEmailTemplate("Something is going wrong, Please try again.");
    }
    setLoading(false);
  };

  return (
    <>
      <div>
        <h1>Create Email template by entering your type of company</h1>
        <input
          onChange={(e) => {
            setInput(e.target.value);
          }}
          value={input}
          type="text"
          placeholder="Icecream shop"
        />
        <button onClick={submitInput}>
          {loading ? "Generating..." : "Generate"}
        </button>
        {emailTemplate && (
          <div className="email">
            <div className="email-body">
              {emailTemplate.map((paragraph, index) => (
                <p key={index} className="email-paragraph">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
