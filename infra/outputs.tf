output "public_ip" {
  description = "Public IP of the instance."
  value       = aws_instance.app.public_ip
}

output "web_dashboard_url" {
  value = "http://${aws_instance.app.public_ip}:3001"
}

output "api_docs_url" {
  value = "http://${aws_instance.app.public_ip}:3000/docs"
}

output "ssh_command" {
  description = "Run this to SSH into the instance (e.g. to check logs)."
  value       = "ssh -i job-search-copilot-key.pem ec2-user@${aws_instance.app.public_ip}"
}
