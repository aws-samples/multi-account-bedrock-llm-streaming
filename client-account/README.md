# Remote Client Testing Environment Setup

This guide will walk you through the process of setting up a remote client testing environment in a client account to interact with cross-account Large Language Models (LLMs) using Invoke Lambda APIs.

## Prerequisites

- Access to a client account with appropriate permissions
- Amazon SageMaker Notebook Instances with a Python environment

## Setup Steps

1. Configure the remote client testing environment in the client account.
   - For this guide, we will be using an Amazon SageMaker Notebook Instances with a Python environment.

2. Locate the Jupyter notebook `remote_client_test.ipynb` in the `./client-account/` directory of your project.

3. Open the `remote_client_test.ipynb` notebook in your Amazon SageMaker Instance.

4. Ensure that the execution role associated with the notebook has the necessary permissions.

5. Run the notebook cells to test the integration and interact with the Invoke Lambda APIs from the client account.

## Expected Results

Upon successful execution of the notebook, you should receive streaming response payloads from the cross-account Large Language Models. These payloads will be returned as a result of invoking the Lambda APIs from the client account.

## Troubleshooting

- If you encounter any permission-related issues, double-check that the execution role associated with the notebook has the required permissions.

By following this guide, you should be able to successfully set up a remote client testing environment and interact with cross-account Large Language Models using Invoke Lambda APIs.
