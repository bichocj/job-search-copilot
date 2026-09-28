variable "aws_region" {
  description = "AWS region to deploy into."
  type        = string
  default     = "us-east-1"
}

variable "instance_type" {
  description = "EC2 instance size. t3.small is enough for this demo (Postgres + 2 Node apps)."
  type        = string
  default     = "t3.small"
}

variable "git_repo_url" {
  description = "HTTPS URL of the GitHub repo containing this project (push your own copy first)."
  type        = string
}

variable "anthropic_api_key" {
  description = "Your Anthropic API key — used by the agent service inside the container."
  type        = string
  sensitive   = true
}

variable "allowed_ssh_cidr" {
  description = "CIDR allowed to SSH into the instance. Restrict this to your own IP in real use (e.g. 1.2.3.4/32)."
  type        = string
  default     = "0.0.0.0/0"
}
