<?php 
defined('BASEPATH') OR exit('No direct script access allowed');

class Main extends CI_Controller {

	public function index()
	{
		$this->load->view('template/header');
		$this->load->view('main');
		$this->load->view('template/footer');
	}

	public function stream()
	{
		$this->load->view('stream');
	}

	public function create(){

		$_pics = $this->input->post('data');

		if($_pics){

			$gif = new GifCreator(0, 2, array(-1, -1, -1), 600, 400);

			foreach ($_pics as $pic) {
				$file = str_replace('data:image/png;base64,', '', $pic);
				// echo '<pre>';
				// print_r($pic);
				// echo '</pre>';
				$image = base64_decode($file);
				$gif->addFrame($image, 20, true);
			}
			$r = random_string('alnum', 16);
			$url = 'media/photo_'.$r.'.gif';

			$total_imagenes = count(glob("*.gif",GLOB_BRACE));
			file_put_contents($url, $gif->getAnimation());

			echo base_url($url);

		}else{
			echo 'error';
		}

	}

}

/* End of file  */
/* Location: ./application/controllers/Main.php */