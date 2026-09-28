# --- SSH key pair (Terraform generates it so you don't need to create one
#     manually in the AWS console first — handy for learning, though in a
#     team setting you'd usually import an existing public key instead). ---
resource "tls_private_key" "this" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "aws_key_pair" "this" {
  key_name   = "job-search-copilot-key"
  public_key = tls_private_key.this.public_key_openssh
}

resource "local_sensitive_file" "private_key" {
  content         = tls_private_key.this.private_key_pem
  filename        = "${path.module}/job-search-copilot-key.pem"
  file_permission = "0400"
}

# --- Security group: SSH (restrict this!), plus the 3 app ports ---
resource "aws_security_group" "app" {
  name        = "job-search-copilot-sg"
  description = "Allow SSH and the app's HTTP ports"

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.allowed_ssh_cidr]
  }

  ingress {
    description = "API"
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Web dashboard"
    from_port   = 3001
    to_port     = 3001
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# --- Latest Amazon Linux 2023 AMI (avoids hardcoding an AMI id that goes
#     stale or doesn't exist in your region) ---
data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-*-x86_64"]
  }
}

resource "aws_instance" "app" {
  ami                    = data.aws_ami.amazon_linux.id
  instance_type          = var.instance_type
  key_name               = aws_key_pair.this.key_name
  vpc_security_group_ids = [aws_security_group.app.id]

  user_data = templatefile("${path.module}/user_data.sh.tpl", {
    git_repo_url      = var.git_repo_url
    anthropic_api_key = var.anthropic_api_key
  })

  tags = {
    Name = "job-search-copilot"
  }
}
