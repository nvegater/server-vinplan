//--- Digital ocean

variable "ssh_key_fingerprint" {
  description = "Fingerprint of the public ssh key stored on DigitalOcean"
}

variable "ssh_public_key" {
  description = "Local public ssh key"
}

variable "do-token" {
  type = string
}

variable "do-region" {
  type = string
}

variable "do-droplet-size" {
  type = string
}

//--- Spaces

variable "spaces-secret-key" {
  type = string
}
variable "spaces-access-id" {
  type = string
}

variable "spaces-endpoint" {
  type = string
}

// --- SSH
