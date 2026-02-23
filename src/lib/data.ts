export type QuestionType = 'multiple-choice' | 'true-false' | 'fill-blank' | 'order-steps';

export interface Question {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  hint?: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  estimatedMinutes: number;
  content: string; // markdown-like text
  questions: Question[];
}

export interface Unit {
  id: string;
  title: string;
  description: string;
  color: string;
  accentColor: string;
  icon: string;
  lessons: Lesson[];
}

export interface Path {
  id: string;
  title: string;
  description: string;
  units: Unit[];
}

export const DEFAULT_PATH: Path = {
  id: 'ai-fundamentals',
  title: 'AI Mastery Path',
  description: 'From zero to hero in Artificial Intelligence',
  units: [
    {
      id: 'unit-1',
      title: 'What is AI?',
      description: 'Understand the basics of Artificial Intelligence',
      color: '#22c55e',
      accentColor: '#16a34a',
      icon: '🤖',
      lessons: [
        {
          id: 'l1-1',
          title: 'Introduction to AI',
          description: 'What is artificial intelligence and why does it matter?',
          icon: '🧠',
          xpReward: 20,
          estimatedMinutes: 5,
          content: `Artificial Intelligence (AI) is the simulation of human intelligence processes by machines, especially computer systems.\n\nAI systems learn from data, identify patterns, and make decisions with minimal human intervention. Today, AI powers everything from your phone's face unlock to medical diagnoses.\n\n**Three types of AI:**\n- **Narrow AI** – Designed for a specific task (e.g., chess engines, spam filters)\n- **General AI** – Hypothetical AI with human-level intelligence across all tasks\n- **Super AI** – Hypothetical AI surpassing human intelligence in every domain`,
          questions: [
            {
              id: 'q1',
              type: 'multiple-choice',
              question: 'What does AI stand for?',
              options: ['Automated Input', 'Artificial Intelligence', 'Algorithmic Integration', 'Automated Intelligence'],
              correctAnswer: 1,
              explanation: 'AI stands for Artificial Intelligence — the simulation of human intelligence by machines.'
            },
            {
              id: 'q2',
              type: 'true-false',
              question: 'General AI (AGI) is widely available and used in everyday applications today.',
              options: ['True', 'False'],
              correctAnswer: 1,
              explanation: 'False! AGI is still theoretical. Current AI systems are Narrow AI, designed for specific tasks.'
            },
            {
              id: 'q3',
              type: 'multiple-choice',
              question: 'Which of these is an example of Narrow AI?',
              options: ['A robot with human-level consciousness', 'A chess-playing program', 'A system smarter than all humans', 'A general-purpose thinking machine'],
              correctAnswer: 1,
              explanation: 'Chess engines like Stockfish are Narrow AI — extremely good at one specific task.'
            }
          ]
        },
        {
          id: 'l1-2',
          title: 'History of AI',
          description: 'From Turing to ChatGPT — the AI timeline',
          icon: '📜',
          xpReward: 20,
          estimatedMinutes: 6,
          content: `The story of AI spans decades of breakthroughs and setbacks.\n\n**Key milestones:**\n- **1950** – Alan Turing proposes the "Turing Test" to measure machine intelligence\n- **1956** – The term "Artificial Intelligence" is coined at the Dartmouth Conference\n- **1997** – IBM's Deep Blue defeats chess world champion Garry Kasparov\n- **2012** – Deep learning revolution begins with AlexNet winning ImageNet\n- **2017** – Google introduces the Transformer architecture\n- **2022** – ChatGPT launches, bringing AI to 100 million users in 2 months\n\n**AI Winters** were periods of reduced funding and interest (1970s, 1980s) when AI failed to meet expectations.`,
          questions: [
            {
              id: 'q1',
              type: 'multiple-choice',
              question: 'Who proposed the Turing Test?',
              options: ['John McCarthy', 'Alan Turing', 'Marvin Minsky', 'Geoffrey Hinton'],
              correctAnswer: 1,
              explanation: 'Alan Turing proposed the Turing Test in 1950 as a way to evaluate machine intelligence.'
            },
            {
              id: 'q2',
              type: 'multiple-choice',
              question: 'What was significant about AlexNet in 2012?',
              options: ['It beat a chess champion', 'It started the deep learning revolution', 'It created ChatGPT', 'It invented the Transformer'],
              correctAnswer: 1,
              explanation: 'AlexNet\'s victory in ImageNet 2012 demonstrated the power of deep learning and sparked the modern AI era.'
            },
            {
              id: 'q3',
              type: 'true-false',
              question: 'The Transformer architecture was introduced by Google in 2017.',
              options: ['True', 'False'],
              correctAnswer: 0,
              explanation: 'True! The paper "Attention Is All You Need" by Google introduced Transformers in 2017, revolutionizing NLP.'
            }
          ]
        },
        {
          id: 'l1-3',
          title: 'How Machines Learn',
          description: 'The core concept of machine learning explained',
          icon: '⚙️',
          xpReward: 25,
          estimatedMinutes: 7,
          content: `Machine Learning (ML) is a subset of AI where systems learn from data without being explicitly programmed.\n\n**The Learning Process:**\n1. **Data Collection** – Gather lots of examples\n2. **Training** – The model finds patterns in the data\n3. **Evaluation** – Test how well it learned\n4. **Prediction** – Apply learning to new data\n\n**Types of Machine Learning:**\n- **Supervised Learning** – Learning from labeled examples (e.g., spam detection)\n- **Unsupervised Learning** – Finding patterns in unlabeled data (e.g., customer segmentation)\n- **Reinforcement Learning** – Learning through rewards and penalties (e.g., game-playing AI)`,
          questions: [
            {
              id: 'q1',
              type: 'multiple-choice',
              question: 'In supervised learning, the training data is:',
              options: ['Unlabeled', 'Labeled with correct answers', 'Generated by the model', 'Random noise'],
              correctAnswer: 1,
              explanation: 'Supervised learning uses labeled data — each example has the correct answer for the model to learn from.'
            },
            {
              id: 'q2',
              type: 'multiple-choice',
              question: 'Which type of ML does a game-playing AI (like AlphaGo) primarily use?',
              options: ['Supervised Learning', 'Unsupervised Learning', 'Reinforcement Learning', 'Transfer Learning'],
              correctAnswer: 2,
              explanation: 'AlphaGo uses Reinforcement Learning — it learns by playing games and receiving rewards for winning.'
            },
            {
              id: 'q3',
              type: 'order-steps',
              question: 'What is the correct order of the machine learning process?',
              options: ['Prediction → Training → Data Collection → Evaluation', 'Data Collection → Training → Evaluation → Prediction', 'Training → Data Collection → Prediction → Evaluation', 'Evaluation → Data Collection → Training → Prediction'],
              correctAnswer: 1,
              explanation: 'The ML pipeline goes: collect data → train model → evaluate performance → make predictions.'
            }
          ]
        }
      ]
    },
    {
      id: 'unit-2',
      title: 'Neural Networks',
      description: 'How AI brains are built',
      color: '#3b82f6',
      accentColor: '#2563eb',
      icon: '🧬',
      lessons: [
        {
          id: 'l2-1',
          title: 'Neurons & Layers',
          description: 'The building blocks of neural networks',
          icon: '🔵',
          xpReward: 30,
          estimatedMinutes: 8,
          content: `Neural networks are inspired by the human brain. They consist of interconnected nodes (neurons) organized in layers.\n\n**The Three Layer Types:**\n- **Input Layer** – Receives raw data (e.g., pixel values of an image)\n- **Hidden Layers** – Process and transform the data\n- **Output Layer** – Produces the final prediction\n\n**How a neuron works:**\n1. Receives inputs from previous neurons\n2. Multiplies each by a **weight** (importance)\n3. Adds a **bias** value\n4. Passes through an **activation function**\n5. Sends output to the next layer\n\nDeep neural networks have many hidden layers — that\'s where "deep learning" gets its name!`,
          questions: [
            {
              id: 'q1',
              type: 'multiple-choice',
              question: 'What do weights in a neural network represent?',
              options: ['The size of the network', 'The importance of each connection', 'The number of neurons', 'The training time'],
              correctAnswer: 1,
              explanation: 'Weights determine how much influence each input has on the neuron\'s output — they are learned during training.'
            },
            {
              id: 'q2',
              type: 'true-false',
              question: 'A deep neural network has many hidden layers.',
              options: ['True', 'False'],
              correctAnswer: 0,
              explanation: 'True! "Deep" in deep learning refers to the many hidden layers that allow the network to learn complex patterns.'
            },
            {
              id: 'q3',
              type: 'multiple-choice',
              question: 'Which layer receives the raw input data in a neural network?',
              options: ['Output layer', 'Hidden layer', 'Input layer', 'Activation layer'],
              correctAnswer: 2,
              explanation: 'The input layer is the first layer and receives the raw data (like image pixels or text tokens).'
            }
          ]
        },
        {
          id: 'l2-2',
          title: 'Training & Backpropagation',
          description: 'How neural networks learn from mistakes',
          icon: '🔄',
          xpReward: 35,
          estimatedMinutes: 10,
          content: `Training a neural network means adjusting its weights so it makes better predictions.\n\n**The Training Loop:**\n1. **Forward Pass** – Input flows through the network to produce a prediction\n2. **Loss Calculation** – Compare prediction to the correct answer using a loss function\n3. **Backpropagation** – Calculate how much each weight contributed to the error\n4. **Gradient Descent** – Adjust weights slightly in the direction that reduces error\n5. Repeat thousands of times!\n\n**Key Terms:**\n- **Loss Function** – Measures how wrong the prediction is (lower = better)\n- **Learning Rate** – How big of a step to take when adjusting weights\n- **Epoch** – One full pass through the entire training dataset\n- **Overfitting** – When a model memorizes training data but fails on new data`,
          questions: [
            {
              id: 'q1',
              type: 'multiple-choice',
              question: 'What does backpropagation calculate?',
              options: ['The final prediction', 'How much each weight contributed to the error', 'The number of layers needed', 'The training data size'],
              correctAnswer: 1,
              explanation: 'Backpropagation computes gradients — how much each weight contributed to the prediction error.'
            },
            {
              id: 'q2',
              type: 'multiple-choice',
              question: 'A model that performs perfectly on training data but poorly on new data is suffering from:',
              options: ['Underfitting', 'Overfitting', 'High learning rate', 'Gradient descent'],
              correctAnswer: 1,
              explanation: 'Overfitting occurs when a model memorizes training examples instead of learning general patterns.'
            },
            {
              id: 'q3',
              type: 'true-false',
              question: 'A higher learning rate always leads to better training results.',
              options: ['True', 'False'],
              correctAnswer: 1,
              explanation: 'False! Too high a learning rate causes the model to overshoot optimal weights. Too low makes training very slow.'
            }
          ]
        }
      ]
    },
    {
      id: 'unit-3',
      title: 'Large Language Models',
      description: 'Understanding GPT, Claude, and modern AI',
      color: '#a855f7',
      accentColor: '#9333ea',
      icon: '💬',
      lessons: [
        {
          id: 'l3-1',
          title: 'What are LLMs?',
          description: 'The technology behind ChatGPT and Claude',
          icon: '📝',
          xpReward: 35,
          estimatedMinutes: 8,
          content: `Large Language Models (LLMs) are neural networks trained on massive amounts of text data to understand and generate human language.\n\n**How LLMs work:**\n1. Text is broken into **tokens** (word pieces)\n2. Tokens are converted to numerical **embeddings**\n3. The **Transformer** architecture processes relationships between tokens\n4. The model predicts the most likely next token\n\n**Scale is key:**\n- GPT-3: 175 billion parameters\n- GPT-4: estimated 1+ trillion parameters\n- More parameters = more capacity to learn patterns\n\n**Famous LLMs:**\n- **GPT-4** (OpenAI) – Powers ChatGPT\n- **Claude** (Anthropic) – Focused on safety\n- **Gemini** (Google) – Multimodal AI\n- **Llama** (Meta) – Open source`,
          questions: [
            {
              id: 'q1',
              type: 'multiple-choice',
              question: 'What are "tokens" in the context of LLMs?',
              options: ['Cryptocurrency used to pay for AI', 'Pieces of text the model processes', 'The neurons in the network', 'Training examples'],
              correctAnswer: 1,
              explanation: 'Tokens are chunks of text (words or word-pieces) that LLMs process. "Hello world" might be 2 tokens.'
            },
            {
              id: 'q2',
              type: 'multiple-choice',
              question: 'Which company created Claude?',
              options: ['OpenAI', 'Google', 'Anthropic', 'Meta'],
              correctAnswer: 2,
              explanation: 'Claude is made by Anthropic, an AI safety company founded in 2021.'
            },
            {
              id: 'q3',
              type: 'true-false',
              question: 'LLMs generate text by predicting the most likely next token.',
              options: ['True', 'False'],
              correctAnswer: 0,
              explanation: 'True! LLMs are trained to predict the next token, and by doing this repeatedly they generate coherent text.'
            }
          ]
        },
        {
          id: 'l3-2',
          title: 'Prompt Engineering',
          description: 'The art of talking to AI effectively',
          icon: '🎯',
          xpReward: 40,
          estimatedMinutes: 10,
          content: `Prompt Engineering is the practice of crafting inputs to AI systems to get the best outputs.\n\n**Core Techniques:**\n\n**1. Zero-Shot Prompting**\nAsk the AI directly without examples:\n> "Translate this to French: Hello world"\n\n**2. Few-Shot Prompting**\nProvide examples before your request:\n> "Positive: Great product! → Happy\nNegative: Terrible quality → Sad\nNeutral: It arrived → ?"\n\n**3. Chain-of-Thought**\nAsk the AI to reason step by step:\n> "Think step by step: If I have 3 apples..."\n\n**4. Role Prompting**\nAssign a persona:\n> "You are an expert Python developer. Review this code..."\n\n**Best Practices:**\n- Be specific and clear\n- Provide context\n- Specify the output format\n- Iterate and refine`,
          questions: [
            {
              id: 'q1',
              type: 'multiple-choice',
              question: 'What is "few-shot prompting"?',
              options: ['Using very short prompts', 'Providing examples in your prompt', 'Asking multiple questions at once', 'Using AI with limited data'],
              correctAnswer: 1,
              explanation: 'Few-shot prompting means including a few examples in your prompt to show the AI the pattern you want.'
            },
            {
              id: 'q2',
              type: 'multiple-choice',
              question: 'Chain-of-thought prompting helps AI by:',
              options: ['Making responses shorter', 'Asking it to reason step by step', 'Limiting its vocabulary', 'Reducing hallucinations automatically'],
              correctAnswer: 1,
              explanation: 'Chain-of-thought prompting asks the model to show its reasoning, which significantly improves accuracy on complex tasks.'
            },
            {
              id: 'q3',
              type: 'true-false',
              question: 'Role prompting (assigning a persona) can improve AI response quality.',
              options: ['True', 'False'],
              correctAnswer: 0,
              explanation: 'True! Telling an AI to act as an expert in a domain often improves the quality and style of its responses.'
            }
          ]
        }
      ]
    },
    {
      id: 'unit-4',
      title: 'AI Ethics & Safety',
      description: 'Responsible AI development',
      color: '#f59e0b',
      accentColor: '#d97706',
      icon: '⚖️',
      lessons: [
        {
          id: 'l4-1',
          title: 'AI Bias & Fairness',
          description: 'When AI discriminates and how to fix it',
          icon: '⚠️',
          xpReward: 40,
          estimatedMinutes: 8,
          content: `AI systems can perpetuate and amplify human biases present in their training data.\n\n**Types of Bias:**\n- **Historical Bias** – Past discrimination encoded in data (e.g., hiring data favoring men)\n- **Representation Bias** – Underrepresentation of groups (e.g., face recognition failing on dark skin)\n- **Measurement Bias** – Flawed data collection methods\n- **Aggregation Bias** – Treating diverse groups as homogeneous\n\n**Real-world examples:**\n- Facial recognition systems with higher error rates for women and people of color\n- Loan algorithms that discriminated against minority applicants\n- Hiring tools that penalized resumes mentioning "women's" activities\n\n**Solutions:**\n- Diverse and representative training data\n- Fairness metrics and auditing\n- Diverse AI development teams\n- Transparency and explainability`,
          questions: [
            {
              id: 'q1',
              type: 'multiple-choice',
              question: 'Historical bias in AI occurs when:',
              options: ['The AI is too old', 'Past human discrimination is encoded in training data', 'The model was trained on historical documents only', 'The AI cannot process new information'],
              correctAnswer: 1,
              explanation: 'Historical bias happens when training data reflects past discriminatory practices, causing the AI to perpetuate them.'
            },
            {
              id: 'q2',
              type: 'true-false',
              question: 'Having diverse AI development teams can help reduce bias in AI systems.',
              options: ['True', 'False'],
              correctAnswer: 0,
              explanation: 'True! Diverse teams are more likely to identify potential biases and consider impacts on underrepresented groups.'
            },
            {
              id: 'q3',
              type: 'multiple-choice',
              question: 'Representation bias occurs when:',
              options: ['The model is too large', 'Certain groups are underrepresented in training data', 'The AI represents data as images', 'The bias is intentional'],
              correctAnswer: 1,
              explanation: 'Representation bias happens when some groups appear much less in training data, causing the model to perform worse for them.'
            }
          ]
        }
      ]
    },
    {
      id: 'unit-5',
      title: 'Advanced AI Concepts',
      description: 'Cutting-edge AI research and techniques',
      color: '#ef4444',
      accentColor: '#dc2626',
      icon: '🚀',
      lessons: [
        {
          id: 'l5-1',
          title: 'Transformers & Attention',
          description: 'The architecture powering modern AI',
          icon: '🔮',
          xpReward: 50,
          estimatedMinutes: 12,
          content: `The Transformer architecture, introduced in 2017, revolutionized AI and powers virtually all modern LLMs.\n\n**The Core Innovation: Self-Attention**\nSelf-attention allows each token to "attend" to all other tokens in the sequence, capturing long-range dependencies.\n\n**How Attention Works:**\n1. Each token creates **Query (Q)**, **Key (K)**, and **Value (V)** vectors\n2. Attention score = Q · K (how relevant is each token?)\n3. Scores are normalized with **Softmax**\n4. Output = weighted sum of V vectors\n\n**Multi-Head Attention**\nMultiple attention heads run in parallel, each learning different relationship types (syntax, semantics, co-reference).\n\n**Why Transformers won:**\n- Processes all tokens in parallel (faster than RNNs)\n- Captures long-range dependencies better\n- Scales extremely well with more data and compute`,
          questions: [
            {
              id: 'q1',
              type: 'multiple-choice',
              question: 'What is the key innovation of the Transformer architecture?',
              options: ['Recurrent connections', 'Self-attention mechanism', 'Convolutional filters', 'Dropout regularization'],
              correctAnswer: 1,
              explanation: 'Self-attention is the core innovation — it allows the model to weigh the importance of all tokens relative to each other.'
            },
            {
              id: 'q2',
              type: 'multiple-choice',
              question: 'In the attention mechanism, Q, K, V stand for:',
              options: ['Quality, Knowledge, Volume', 'Query, Key, Value', 'Quantize, Kernel, Vector', 'Quick, Known, Valid'],
              correctAnswer: 1,
              explanation: 'Q = Query (what am I looking for?), K = Key (what do I contain?), V = Value (what information do I provide?).'
            },
            {
              id: 'q3',
              type: 'true-false',
              question: 'Transformers process tokens sequentially, one at a time, like RNNs.',
              options: ['True', 'False'],
              correctAnswer: 1,
              explanation: 'False! Transformers process all tokens in parallel, which makes them much faster to train than sequential RNNs.'
            }
          ]
        },
        {
          id: 'l5-2',
          title: 'Fine-tuning & RLHF',
          description: 'How AI is aligned with human values',
          icon: '🎓',
          xpReward: 55,
          estimatedMinutes: 12,
          content: `Fine-tuning adapts a pre-trained model to specific tasks or behaviors. RLHF (Reinforcement Learning from Human Feedback) is how models like ChatGPT are made helpful and safe.\n\n**Fine-tuning Process:**\n1. Start with a pre-trained base model\n2. Train further on task-specific data\n3. The model specializes while retaining general knowledge\n\n**RLHF Pipeline:**\n1. **Supervised Fine-Tuning (SFT)** – Train on high-quality human demonstrations\n2. **Reward Model Training** – Humans rank AI responses; a reward model learns human preferences\n3. **PPO Training** – The LLM is trained with RL to maximize the reward model\'s score\n\n**Why RLHF matters:**\n- Makes AI follow instructions better\n- Reduces harmful outputs\n- Aligns AI behavior with human values\n\n**Alternatives:**\n- **DPO** (Direct Preference Optimization) – Simpler alternative to RLHF\n- **Constitutional AI** – Anthropic\'s approach using AI feedback`,
          questions: [
            {
              id: 'q1',
              type: 'multiple-choice',
              question: 'What does RLHF stand for?',
              options: ['Recursive Learning with Hidden Features', 'Reinforcement Learning from Human Feedback', 'Regularized Loss with High Fidelity', 'Recurrent Language with Human Fine-tuning'],
              correctAnswer: 1,
              explanation: 'RLHF = Reinforcement Learning from Human Feedback. Humans rank AI outputs, and a reward model is trained on those rankings.'
            },
            {
              id: 'q2',
              type: 'multiple-choice',
              question: 'What is the purpose of the Reward Model in RLHF?',
              options: ['To generate text faster', 'To learn what outputs humans prefer', 'To reduce model size', 'To translate between languages'],
              correctAnswer: 1,
              explanation: 'The reward model is trained on human preference data to predict which AI responses humans would rate higher.'
            },
            {
              id: 'q3',
              type: 'true-false',
              question: 'Constitutional AI (CAI) is an approach developed by Anthropic.',
              options: ['True', 'False'],
              correctAnswer: 0,
              explanation: 'True! Constitutional AI is Anthropic\'s technique where AI critiques and revises its own outputs based on a set of principles.'
            }
          ]
        }
      ]
    }
  ]
};
