function fetchResults() 
{
    let chat = document.getElementById("text-input").value;
    if (!chat.trim()) return; 
    AppendMessage("user", chat);
    document.getElementById("text-input").value = "";
    document.getElementsByClassName("header")[0].style.display = "none";
    fetchApiResponse(chat);
}

async function fetchApiResponse(chat) 
{
    try 
    {
        const resp = await fetch(
            'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
            {
                method: 'POST',
                headers: 
                {
                    'Content-Type': 'application/json',
                    'X-goog-api-key': 'AIzaSyBRbZtBR6zAntKOD-HGlF_SjJk0VGwqMGg'
                },
                body: JSON.stringify({
                    'contents': [
                        {
                            'parts': [
                                {
                                    'text': chat,
                                }
                            ]
                        }
                    ]
                })
            });

        const response = await resp.json();
        let responseText = response.candidates[0].content.parts[0].text;
        responseText = formatResponse(responseText);

        AppendMessage("Gemini", responseText);
    } 
    catch (error) 
    {
        AppendMessage("Gemini", "<p>Sorry, something went wrong. Please try again.</p>");
        console.error(error);
    } finally 
    {
        const loadingEl = document.getElementById("loading");
        if (loadingEl) loadingEl.remove();
    }
}

function AppendMessage(sender, chat) 
{
    let chatArea = document.getElementById("chatArea");

    const msgElement = document.createElement("div");
    msgElement.className = `message ${sender}`;
    msgElement.innerHTML = `<p>${chat}</p>`;
    chatArea.appendChild(msgElement);

    if (sender === "user") 
    {
        const loading = document.createElement("div");
        loading.className = "loading Gemini";
        loading.id = "loading";
        loading.innerText = "loading...";
        chatArea.appendChild(loading);
    }   
    chatArea.scrollTop = chatArea.scrollHeight;
}

function formatResponse(text)
{   
    text = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
        .replace(/\*(.*?)\*/g, '<em>$1</em>');           
    
    text = text.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');

    if (text.match(/^- .*/gm)) 
    {
        text = text.replace(/^-\s+(.*)/gm, '<li>$1</li>');
        text = text.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>'); 
    }
   
    text = text.replace(/\n/g, '<br>');

    return text;
}

function toggle() 
{
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    document.getElementById("theme-toggle").innerText = isDark ? "Light" : "Dark";
}
