# Private link Multi-Account Setup



With AWS PrivateLink you can link your own VPCs, on-premise networks, and supported AWS services (e.g. Amazon Lambda, Amazon Bedrock) privately (private IP) without exposing your data to the public internet. See more details at 
[Build GenAI Applications Using Amazon Bedrock With AWS PrivateLink To Protect Your Data Privacy ](https://community.aws/concepts/build-GenAI-app-Bedrock-privateLink)

## Solution Components

### ML Account (us-east-1)

- **Bedrock**: AWS Managed Gen AI service responsible for the core logic of the LLM streaming architecture sitting in ML team account
- **Bedrock Endpoint**: The network endpoint that allows for the requests to invoke Bedrock service within the VPC.
- **ML Lambda with ENI**: A Lambda function equipped with an Elastic Network Interface (ENI) for VPC integration. It is responsible for invoking the Bedrock service using InvokeModelWithResponseStreamCommand to support streaming response.

### Application Account at us-east-1

- **Application user Notebook within VPC**: An AWS SageMaker Notebook instance with ENI configured to connect securely to remote AWS resources including Bedrock service offered by ML account.
- **Application Lambda with ENI**: A Lambda function with VPC integration to invoke requests within VPC to Bedrock service managed by ML team at us-east-1.
- **Lambda VPC Endpoint**: VPC endpoint for allowing Lambda within VPC to invoke AWS services (Bedrock) within the VPC.
- **Regional STS Endpoint**: VPC endpoint for the AWS Security Token Service (STS), facilitating secure token issuance for cross-account access from application account to ML account.
- **Transit Gateway (TGW)**: Enables network connectivity between VPCs at us-east-1 and ap-southeast-1.
- **Private Hosted Zone**: A DNS service allowing the mapping of domain names (STS and Lambda) to the service endpoints within the VPC.

### Application Account at ap-southeast-1

- **Application user Notebook within VPC**: An AWS SageMaker Notebook instance with ENI configured to connect securely to AWS resources including Bedrock service offered by ML account at us-east-1.

## Architecture Illustration
[Insert your architecture diagram or image here]

### 1. **Cross-Account Access** 
In order to let the incoming requests from Application account to execute the ML Lambda and invoke Bedrock service at us-east-1 under ML account, we use IAM and STS to assume role. The Application Lambda or SageMaker notebook assumes a role with necessary permissions to perform Lambda invoke action in the ML Account. Due to the requirement that Cross-account PrivateLink must be happening within the same region, both STS and Lambda VPC endpoints are set up at us-east-1.

### 2. **Invocation**: 

#### From the Application Lambda or SageMaker Notebook within the Application Account at us-east-1 
The request will invoke ML account's lambda at us-east-1. As the requester is sitting at private subnet under Application account, we leverage Lambda VPC endpoint at us-east-1 to faciliate the communication and access control from VPC to Lambda service. Once the request reaches the Lambda at ML account, it will invoke the Bedrock service through Bedrock VPC endpoint.

#### From the Application Lambda or SageMaker Notebook within the Application Account at ap-southeast-1 
The request will invoke  ML account's lambda at us-east-1. As the requester is sitting at private subnet of Application account outside of us-east-1 region, we need to send the request traffics from ap-southeast-1 to VPC endpoints located at us-east-1 through VPC peering or TGW. Once the request reaches the Lambda at ML account, it will invoke the Bedrock service through Bedrock VPC endpoint.

### 3. **DNS Resolve**: 
In order to share Application account VPC endpoints provisioned at us-east-1 to VPCs at other regions, we use Private Hosted Zone (PHZ).

First we need to disable DNS at STS VPC endpoint and Lambda VPC endpoint at us-east-1. 
![Diagram](./images/sts-endpoint-1.png "STS VPC endpoint")

.
4. **Networking**: All networking between the different components is secure and private, facilitated by the use of ENIs and VPC endpoints.
5. **Logging and Monitoring**: Actions and data flows are logged via CloudTrail, and operational health can be monitored and alerted on through CloudWatch.


## Getting Started
To get started with this solution, follow these steps:
