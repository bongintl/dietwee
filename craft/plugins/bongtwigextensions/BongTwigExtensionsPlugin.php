<?php
namespace Craft;

class BongTwigExtensionsPlugin extends BasePlugin
{
	public function getName()
	{
		 return Craft::t('BONG Twig Extensions');
	}
	
	public function getVersion()
	{
		return '1.0.0';
	}

	public function getDeveloper()
	{
		return 'BONG';
	}

	public function getDeveloperUrl()
	{
		return 'http://bong.international';
	}

	public function addTwigExtension()
    {
        Craft::import('plugins.bongtwigextensions.twigextensions.BongTwigExtension');
        
        return new BongTwigExtension();
    }
}