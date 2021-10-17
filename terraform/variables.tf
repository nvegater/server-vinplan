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

// --- App

variable "hostname" {
  default = "wenoserver"
}
variable "db_postgres" {
  default = "wenop"
}
variable "db_redis" {
  default = "wenor"
}
variable "docker_tag_version" {
  default = "1.2.19"
}
variable "docker_registry_prefix" {
  default = "nvegater/vinplan-server"
}
variable "domain_name" {
  default = "test-vinplan.com"
}
variable "cert_maintainer_email" {
  default = "nico_vt@protonmail.com"
}
