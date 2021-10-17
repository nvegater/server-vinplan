terraform {
  required_version = ">= 1.0.0"

  required_providers { # install from the terraform registry
    digitalocean = {
      source  = "digitalocean/digitalocean" # short for: https://registry.terraform.io/providers/digitalocean/digitalocean/latest
      version = "~> 2.0"
    }
  }
}

provider "digitalocean" {
  token = var.do-token
  spaces_access_id = var.spaces-access-id
  spaces_endpoint = var.spaces-endpoint
  spaces_secret_key = var.spaces-secret-key
}

resource "digitalocean_ssh_key" "terraform_dokku" {
  name       = "Terraform Dokku"
  public_key = var.ssh_public_key
}

resource "digitalocean_droplet" "wenoserver" {
  image     = "ubuntu-18-04-x64"
  name      = var.hostname
  region    = var.do-region
  size      = var.do-droplet-size
  ssh_keys = [
    var.ssh_key_fingerprint,
    digitalocean_ssh_key.terraform_dokku.fingerprint
  ]
  user_data = data.template_file.cloud-init-yaml.rendered
}

# Setup a DO volume
resource "digitalocean_volume" "wenoserver-volume-1" {
  region = var.do-region
  name = "wenoserver-volume-1"
  size = 2
  initial_filesystem_type = "ext4"
  description = "wenoserver volume 1"
}

# Connect the volume to the droplet
resource "digitalocean_volume_attachment" "wenoserver-volume-1" {
  droplet_id = digitalocean_droplet.wenoserver.id
  volume_id = digitalocean_volume.wenoserver-volume-1.id
}

data "template_file" "cloud-init-yaml" {
  template = file("${path.module}/files/cloud-init.yaml")
  vars = {
    init_ssh_public_key = var.ssh_public_key
    hostname = var.hostname
  }
}
